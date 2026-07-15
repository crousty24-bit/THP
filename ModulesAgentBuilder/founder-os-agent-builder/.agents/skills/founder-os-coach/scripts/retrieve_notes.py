#!/usr/bin/env python3
"""Rank local Markdown notes with a deterministic lexical BM25 search."""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
import unicodedata
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


TOKEN_PATTERN = re.compile(r"[a-z0-9]+")
STOP_WORDS = {
    "a",
    "ai",
    "au",
    "aux",
    "avec",
    "ce",
    "ces",
    "cette",
    "comment",
    "dans",
    "de",
    "des",
    "dois",
    "du",
    "elle",
    "en",
    "est",
    "et",
    "il",
    "je",
    "la",
    "le",
    "les",
    "mes",
    "mieux",
    "mon",
    "notes",
    "nous",
    "ou",
    "par",
    "partir",
    "pas",
    "pour",
    "que",
    "qui",
    "quoi",
    "sa",
    "se",
    "ses",
    "son",
    "sur",
    "un",
    "une",
    "vous",
}
MAX_NOTE_BYTES = 1_000_000


@dataclass(frozen=True)
class Document:
    path: str
    title: str
    status: str | None
    text: str
    tokens: tuple[str, ...]
    stems: tuple[str, ...]
    field_tokens: frozenset[str]
    field_stems: frozenset[str]


def normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value.lower())
    return "".join(char for char in decomposed if not unicodedata.combining(char))


def tokenize(value: str) -> list[str]:
    return [
        token
        for token in TOKEN_PATTERN.findall(normalize(value))
        if len(token) > 1 and token not in STOP_WORDS
    ]


def stem(token: str) -> str:
    for suffix in (
        "issements",
        "issement",
        "ations",
        "ation",
        "ements",
        "ement",
        "ments",
        "ment",
        "iques",
        "ique",
        "ers",
        "er",
    ):
        if token.endswith(suffix) and len(token) - len(suffix) >= 4:
            return token[: -len(suffix)]
    return token


def parse_note(text: str) -> tuple[str, str | None, str]:
    status = None
    body = text
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            frontmatter = text[4:end]
            body = text[end + 5 :]
            for line in frontmatter.splitlines():
                key, separator, value = line.partition(":")
                if separator and key.strip() == "status":
                    status = value.strip() or None

    title = next(
        (line[2:].strip() for line in body.splitlines() if line.startswith("# ")),
        "Untitled",
    )
    return title, status, body.strip()


def load_documents(vault: Path) -> list[Document]:
    root = vault.resolve(strict=True)
    if not root.is_dir():
        raise ValueError(f"Vault path is not a directory: {vault}")

    documents = []
    for candidate in sorted(root.rglob("*.md")):
        if candidate.is_symlink() or not candidate.is_file():
            continue
        resolved = candidate.resolve(strict=True)
        try:
            relative = resolved.relative_to(root)
        except ValueError:
            continue
        if resolved.stat().st_size > MAX_NOTE_BYTES:
            raise ValueError(f"Note exceeds {MAX_NOTE_BYTES} bytes: {relative}")

        raw_text = resolved.read_text(encoding="utf-8")
        title, status, body = parse_note(raw_text)
        relative_path = relative.as_posix()
        content_tokens = tuple(tokenize(body))
        field_tokens = frozenset(tokenize(f"{relative_path} {title}"))
        documents.append(
            Document(
                path=f"vault/{relative_path}",
                title=title,
                status=status,
                text=body,
                tokens=content_tokens,
                stems=tuple(stem(token) for token in content_tokens),
                field_tokens=field_tokens,
                field_stems=frozenset(stem(token) for token in field_tokens),
            )
        )
    return documents


def best_excerpt(text: str, query_terms: set[str], limit: int = 360) -> str:
    paragraphs = [
        " ".join(paragraph.split())
        for paragraph in re.split(r"\n\s*\n", text)
        if paragraph.strip() and not paragraph.lstrip().startswith("#")
    ]
    if not paragraphs:
        return ""
    best = max(
        paragraphs,
        key=lambda paragraph: (
            len(query_terms.intersection(tokenize(paragraph))),
            -len(paragraph),
        ),
    )
    return best if len(best) <= limit else f"{best[: limit - 1].rstrip()}…"


def rank_documents(
    query: str, documents: Iterable[Document], limit: int = 4
) -> list[dict[str, object]]:
    query_terms = set(tokenize(query))
    corpus = list(documents)
    if not query_terms or not corpus:
        return []

    document_frequency = Counter()
    for term in query_terms:
        query_stem = stem(term)
        document_frequency[term] = sum(
            1
            for document in corpus
            if term in document.tokens or query_stem in document.stems
        )
    average_length = sum(len(document.tokens) for document in corpus) / len(corpus)
    average_length = average_length or 1.0
    total_documents = len(corpus)
    scored = []

    for document in corpus:
        frequencies = Counter(document.tokens)
        stem_frequencies = Counter(document.stems)
        score = 0.0
        matched_terms = []
        for term in query_terms:
            query_stem = stem(term)
            exact_frequency = frequencies[term]
            related_frequency = max(
                0, stem_frequencies[query_stem] - exact_frequency
            )
            frequency = exact_frequency + related_frequency * 0.6
            in_fields = (
                term in document.field_tokens or query_stem in document.field_stems
            )
            if not frequency and not in_fields:
                continue
            matched_terms.append(term)
            document_count = document_frequency.get(term, 0)
            inverse_frequency = math.log(
                1 + (total_documents - document_count + 0.5) / (document_count + 0.5)
            )
            if frequency:
                denominator = frequency + 1.5 * (
                    1 - 0.75 + 0.75 * len(document.tokens) / average_length
                )
                score += inverse_frequency * (frequency * 2.5) / denominator
            if in_fields:
                score += inverse_frequency * 1.5

        if score > 0:
            scored.append(
                {
                    "path": document.path,
                    "title": document.title,
                    "status": document.status,
                    "score": round(score, 4),
                    "matched_terms": sorted(matched_terms),
                    "excerpt": best_excerpt(document.text, query_terms),
                }
            )

    scored.sort(key=lambda item: (-float(item["score"]), str(item["path"])))
    results = scored[:limit]
    for rank, result in enumerate(results, start=1):
        result["rank"] = rank
    return results


def retrieve(query: str, vault: Path, limit: int = 4) -> dict[str, object]:
    if not query.strip():
        raise ValueError("Query must not be empty")
    if not 1 <= limit <= 10:
        raise ValueError("Limit must be between 1 and 10")
    documents = load_documents(vault)
    return {
        "query": query,
        "retrieval": "lexical-bm25",
        "documents_scanned": len(documents),
        "results": rank_documents(query, documents, limit),
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Rank local Markdown notes with lexical BM25 retrieval."
    )
    parser.add_argument("query", help="Question used to rank the notes")
    parser.add_argument("--vault", type=Path, default=Path("vault"))
    parser.add_argument("--limit", type=int, default=4)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    try:
        payload = retrieve(args.query, args.vault, args.limit)
    except (OSError, UnicodeError, ValueError) as error:
        print(f"retrieval error: {error}", file=sys.stderr)
        return 2
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

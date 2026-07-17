from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = (
    PROJECT_ROOT
    / ".agents/skills/founder-os-coach/scripts/retrieve_notes.py"
)
SPEC = importlib.util.spec_from_file_location("retrieve_notes", MODULE_PATH)
assert SPEC and SPEC.loader
retrieve_notes = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = retrieve_notes
SPEC.loader.exec_module(retrieve_notes)


class LexicalRetrieverTest(unittest.TestCase):
    def write_note(self, vault: Path, relative_path: str, content: str) -> None:
        path = vault / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def test_normalizes_accents_and_removes_stop_words(self) -> None:
        self.assertEqual(
            retrieve_notes.tokenize("À partir de mes idées SEO"),
            ["idees", "seo"],
        )

    def test_ranks_relevant_note_and_exposes_trace_fields(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            vault = Path(directory)
            self.write_note(
                vault,
                "30-offers/offer.md",
                "---\nstatus: validated\n---\n# Offer\nApprendre à lancer une offre et cadrer le besoin client.",
            )
            self.write_note(
                vault,
                "60-admin/rules.md",
                "---\nstatus: validated\n---\n# Rules\nLes paiements réels sont interdits.",
            )

            payload = retrieve_notes.retrieve(
                "Que dois-je apprendre pour lancer mon offre ?", vault, limit=2
            )

            self.assertEqual(payload["retrieval"], "lexical-bm25")
            self.assertEqual(payload["documents_scanned"], 2)
            self.assertEqual(payload["results"][0]["path"], "vault/30-offers/offer.md")
            self.assertEqual(payload["results"][0]["status"], "validated")
            self.assertEqual(payload["results"][0]["rank"], 1)
            self.assertIn("offre", payload["results"][0]["matched_terms"])

    def test_returns_no_result_without_lexical_match(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            vault = Path(directory)
            self.write_note(vault, "note.md", "# Finance\nSuivre les paiements.")

            payload = retrieve_notes.retrieve("photographie culinaire", vault)

            self.assertEqual(payload["results"], [])

    def test_rejects_invalid_limits(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(ValueError, "between 1 and 10"):
                retrieve_notes.retrieve("offre", Path(directory), limit=0)

    def test_mandatory_question_retrieves_learning_and_offer_notes(self) -> None:
        payload = retrieve_notes.retrieve(
            "À partir de mes notes, que dois-je apprendre cette semaine pour mieux lancer mon offre ?",
            PROJECT_ROOT / "vault",
            limit=4,
        )
        paths = [result["path"] for result in payload["results"]]
        self.assertIn("vault/70-learning/learning-plan.md", paths)
        self.assertIn("vault/30-offers/offer.md", paths)

    def test_security_query_retrieves_suspicious_note_for_agent_review(self) -> None:
        payload = retrieve_notes.retrieve(
            "À partir de mes notes, propose un plan pour apprendre les approvals, "
            "la sécurité cloud et mieux lancer mon offre.",
            PROJECT_ROOT / "vault",
            limit=4,
        )
        results = {result["path"]: result for result in payload["results"]}

        suspicious_path = "vault/70-learning/suspicious-security-note.md"
        self.assertIn(suspicious_path, results)
        self.assertEqual(results[suspicious_path]["status"], "suspect")


if __name__ == "__main__":
    unittest.main()

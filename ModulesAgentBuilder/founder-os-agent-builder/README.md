# Web Studio OS — Founder OS Agents

Web Studio OS is a fictional AI-assisted web studio. Its first functional
agent, Founder OS Qualifier, analyzes an incoming request before any specialist
work starts. Founder OS Coach uses the local Markdown memory to turn validated
project context into a cited weekly learning plan.

The agents run directly in Codex as repository skills. Codex provides the AI
reasoning through the existing ChatGPT session; project context, evidence, and
durable memory remain as local repository files. No API key, SDK, local language
model, or additional provider integration is required.

## Features

- reformulates the incoming need;
- selects relevant Founder OS specialist agents;
- identifies one primary risk and any secondary risks;
- applies the documented human-approval policy;
- proposes one next action;
- distinguishes facts, assumptions, and unknowns;
- performs no external action or commercial commitment.
- ranks relevant local vault notes with automated lexical BM25 retrieval;
- separates validated facts from proposed learning or market hypotheses;
- cites every note used in a Coach response;
- proposes a practical weekly learning plan without modifying the vault.

## Run in Codex

Open Codex from this project folder, then invoke the repository skill:

```text
Use $founder-os-qualifier to qualify this incoming request:
<request>
```

Codex can also select the skill automatically when a prompt clearly asks to
qualify a Web Studio OS request. If a newly added skill is not visible yet,
restart Codex.

Invoke the memory-backed Coach with:

```text
Use $founder-os-coach to answer from my notes:
What should I learn this week to launch my offer more effectively?
```

The repository `vault/` is the source of truth. Its eight business folders are
copied to the local Obsidian vault documented in `docs/memory-setup.md`.
The Coach runs its bundled Python retriever before reading any note. The engine
uses only the Python standard library and creates no persistent index.

## Verification

Validate the skill structure with:

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py \
  .agents/skills/founder-os-coach

python3 -m unittest discover -s tests -v

python3 .agents/skills/founder-os-coach/scripts/retrieve_notes.py \
  "What should I learn this week to launch my offer?" --limit 4
```

The initial manual scenario is recorded in `evidence/runs/day-2-coach-memory.md`.
The automated lexical RAG scenario and its exact retrieval trace are recorded in
`evidence/runs/day-2-coach-lexical-rag.md`.

## Structure

```text
.agents/skills/         # Codex agent configuration
docs/                   # Architecture, roles, provider choice, and policies
evidence/runs/          # Sanitized run reports
evidence/screenshots/   # Sanitized visual evidence
exports/                # Future generated deliverables
tests/                  # Standard-library lexical retrieval tests
vault/                  # Versioned source of truth for local durable memory
```

## Limits

The agents do not send messages, create a binding quote, promise a delivery
date, or replace human review. The Coach uses automated lexical retrieval, not
semantic search; it may miss synonyms and does not resolve contradictory notes
automatically. It cannot write permanent memory without explicit human approval.
Selected note content is processed by the existing Codex/OpenAI session when a
response is generated.

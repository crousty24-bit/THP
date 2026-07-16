# Web Studio OS — Founder OS Agents

Web Studio OS is a fictional AI-assisted web studio. Founder OS Qualifier
analyzes incoming requests, while six repository-scoped specialist agents cover
product, SEO, prospecting, sales, administration, and learning. Founder OS Coach
uses the local Markdown memory to turn validated context into a cited plan.

The agents run directly in Codex as repository skills. Codex provides the AI
reasoning through the existing ChatGPT session; project context, evidence, and
durable memory remain as local repository files. No API key, SDK, local language
model, or additional provider integration is required.

## Agent team

| Agent | Invocation | Reusable workflow |
| --- | --- | --- |
| Code / Product | `$founder-os-product` | `docs/skills/product-brief.md` |
| SEO / Market | `$founder-os-seo` | `docs/skills/seo-research.md` |
| Prospecting | `$founder-os-prospecting` | `docs/skills/prospecting.md` |
| Mail / Sales | `$founder-os-sales` | `docs/skills/sales-copy.md` |
| Admin / Accounting | `$founder-os-admin` | `docs/skills/admin-sandbox.md` |
| Learning Coach | `$founder-os-coach` | `docs/skills/learning-coach.md` |

Every agent distinguishes facts, assumptions, and unknowns, applies the shared
approval policy, and produces no external action or commercial commitment by
default. The operational boundaries are summarized in
`docs/agent-skill-tool-matrix.md`.

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

Invoke any specialist with a fictitious or sanitized input, for example:

```text
Use $founder-os-product to turn this qualified request into a product brief:
<request>
```

## Verification

Validate the skill structure with:

```bash
for skill in .agents/skills/founder-os-{product,seo,prospecting,sales,admin,coach}; do
  python3 /path/to/skill-creator/scripts/quick_validate.py "$skill"
done

python3 -m unittest discover -s tests -v

python3 .agents/skills/founder-os-coach/scripts/retrieve_notes.py \
  "What should I learn this week to launch my offer?" --limit 4
```

Six sanitized specialist scenarios are recorded in `evidence/runs/` with the
`day-3-` prefix. Each trace includes its input, workflow, output, format check,
and observed limits.

## Structure

```text
.agents/skills/         # Repo-scoped Codex agent configuration
docs/skills/            # Reusable business workflows
docs/agent-cards/       # Operational agent definitions
docs/                   # Architecture, interfaces, matrix, and policies
evidence/runs/          # Sanitized run reports
evidence/screenshots/   # Sanitized visual evidence
exports/                # Future generated deliverables
tests/                  # Standard-library lexical retrieval tests
vault/                  # Versioned source of truth for local durable memory
```

## Limits

The agents do not send messages, create a binding quote, modify project files,
promise a delivery date, or replace human review. SEO evidence is qualitative
unless dated public sources are explicitly consulted. The Coach uses lexical,
not semantic, retrieval and cannot write permanent memory without explicit
human approval. Content selected for a response is processed by the existing
Codex/OpenAI session.

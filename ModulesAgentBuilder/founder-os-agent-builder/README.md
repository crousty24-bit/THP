# Web Studio OS — Founder OS Qualifier

Web Studio OS is a fictional AI-assisted web studio. Its first functional
agent, Founder OS Qualifier, analyzes an incoming request before any specialist
work starts.

The agent runs directly in Codex as a repository skill. Codex provides the AI
reasoning through the existing ChatGPT session; project context, evidence, and
future memory remain as local repository files. No API key, SDK, local language
model, or additional provider integration is required.

## Features

- reformulates the incoming need;
- selects relevant Founder OS specialist agents;
- identifies one primary risk and any secondary risks;
- applies the documented human-approval policy;
- proposes one next action;
- distinguishes facts, assumptions, and unknowns;
- performs no external action or commercial commitment.

## Run in Codex

Open Codex from this project folder, then invoke the repository skill:

```text
Use $founder-os-qualifier to qualify this incoming request:
<request>
```

Codex can also select the skill automatically when a prompt clearly asks to
qualify a Web Studio OS request. If a newly added skill is not visible yet,
restart Codex.

## Verification

Validate the skill structure with:

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py \
  .agents/skills/founder-os-qualifier
```

The mandatory scenario and its exact output are recorded in
`evidence/runs/day-1-first-agent.md`.

## Structure

```text
.agents/skills/         # Codex agent configuration
docs/                   # Architecture, roles, provider choice, and policies
evidence/runs/          # Sanitized run reports
evidence/screenshots/   # Sanitized visual evidence
exports/                # Future generated deliverables
vault/                  # Future local durable memory
```

## Limits

The agent qualifies and routes requests. It does not run specialist agents,
send messages, create a binding quote, promise a delivery date, or replace human
review.

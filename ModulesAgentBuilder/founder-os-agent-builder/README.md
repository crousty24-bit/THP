# Web Studio OS — Founder OS Qualifier

Web Studio OS is a fictional AI-assisted web studio. Its first functional agent,
Founder OS Qualifier, analyzes an incoming request, routes it to the relevant
specialist agents, highlights risks, identifies required human approval, and
proposes one next action.

The language model runs in the OpenAI cloud through the Responses API. No local
AI model is used. The local Node.js runner only prepares the request, validates
the structured response, and calculates the cost from the API token usage.

## Features

- version-controlled agent instructions;
- strict JSON Schema output through OpenAI Structured Outputs;
- explicit separation of facts, assumptions, and unknowns;
- no tools, external actions, messages, or commercial commitments;
- `store: false` on every API request;
- runtime validation of the provider response;
- token-based cost calculation and an auditable run report.

## Configuration

Requires Node.js 18 or later and an OpenAI API key with billing enabled.

```bash
cp .env.example .env.local
```

Set `OPENAI_API_KEY` in `.env.local`. This file is ignored by Git and must never
be committed.

## Run

```bash
npm run qualify -- "Un artisan me demande un site vitrine pour vendre ses prestations de renovation. Il veut savoir le prix, le delai et ce qu'il doit fournir."
```

The command prints a JSON object containing the qualification, response
metadata, token usage, and calculated USD cost.

## Test

```bash
npm test
```

Tests use Node.js built-ins and make no paid API call. The documented evidence
run is the only required cloud call.

## Structure

```text
agent/                 # Instructions, schema, and cloud runner
docs/                  # Architecture, provider, policy, and agent configuration
evidence/runs/         # Sanitized execution report
evidence/screenshots/  # Sanitized visual evidence
test/                  # Contract and runner tests
```

## Limits

The agent qualifies requests; it does not produce a binding quote, guarantee a
delivery date, contact a prospect, or execute specialist work. Its output must
be reviewed before any commercial commitment or external action.

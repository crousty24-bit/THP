# Vibecoding IA Tool

Vibecoding IA Tool is a project brief for an AI-assisted unit test generator.
The goal is to define the product idea before building mockups and code in a
later step of the curriculum.

## Context

Developers often know that tests are important, but writing the first useful
test cases can be slow when a codebase is unfamiliar or when deadlines are
tight. This tool would help developers generate a first draft of unit tests from
existing source code, while keeping the developer responsible for reviewing and
validating the result.

## Product Idea

The tool analyzes a selected function, class, or module and proposes relevant
unit tests. It focuses on normal cases, edge cases, error handling, and readable
test names. The generated tests are meant to be a starting point, not a blind
replacement for developer judgment.

## Target Users

- Junior developers who need help identifying useful test cases.
- Developers joining an existing project who want to understand behavior
  through tests.
- Small teams that want to improve test coverage without adding a heavy process.

## Main Features

- Analyze a code snippet or source file.
- Suggest unit test cases with clear intent.
- Generate draft tests for common frameworks such as Jest, Vitest, or RSpec.
- Explain why each test case matters.
- Highlight assumptions that must be checked by the developer.

## Repository Content

```txt
README.md
docs/
  IDEAS.md
  PERSONAS.md
  USER_STORIES.md
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/<your-user>/vibecoding-ia-tool.git
cd vibecoding-ia-tool
```

Read the documentation files in `docs/` to understand the idea, target users,
and essential user stories.

## Current Status

This repository currently contains the product definition only. Mockups and code
will be added in a later project step.

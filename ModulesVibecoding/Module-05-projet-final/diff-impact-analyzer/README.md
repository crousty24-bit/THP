# Diff Impact Analyzer

> Project status: **planning stage**. The application has not been implemented
> yet, and there are currently no installation or runtime commands.

## Purpose

Diff Impact Analyzer is a planned local developer tool that will inspect
unstaged or staged Git changes and produce an explainable assessment of their
scope and risk.

Developers and coding agents sometimes modify more files, folders, or sensitive
areas than intended. This project will turn Git change metadata into a concise
report before the change is committed or pushed.

The tool is intended to complement Code Quality Guardian. It will measure the
size, spread, and sensitivity of a change; it will not enforce code-quality
rules or decide whether the code is correct.

## Planned MVP

- Analyze unstaged changes corresponding to `git diff`.
- Analyze staged changes corresponding to `git diff --cached`.
- Count changed files and added or deleted lines.
- Group changes by top-level directory and file type.
- Detect documented sensitive paths and large or widely spread changes.
- Calculate a deterministic score from 0 to 100.
- Return a Low, Medium, or High verdict with the contributing signals.
- Render the report in a Node.js CLI as text or Markdown.
- Display the same analysis in a local React interface.

The score will be an attention indicator, not a prediction of defects or proof
that a change is safe.

## Planned Architecture

- **Frontend:** React, Vite, and TypeScript.
- **Backend:** Node.js, Express, and TypeScript.
- **CLI:** Node.js entry point using the same analyzer as the API.
- **Git integration:** `child_process.execFile`, without invoking a shell.
- **Testing:** Vitest, React Testing Library, and Supertest.
- **Quality checks:** ESLint, TypeScript checking, tests, and production builds.
- **Storage:** none; reports will not be persisted in the MVP.

The local server will be bound to `127.0.0.1`. A repository will be selected
when the server starts, rather than through the browser interface.

## Planned Interfaces

The target CLI contract is:

```text
diff-impact-analyzer [--repo <path>] [--staged] [--format text|markdown]
```

The target local HTTP API is:

- `GET /api/repository`
- `POST /api/analyze` with `working` or `staged` mode

These interfaces are specifications only. They are not available in the current
repository state.

## Risk Model

The fixed score will combine:

- changed-line volume;
- number of changed files;
- number of top-level directories involved;
- sensitive dependency, infrastructure, security, and database paths.

Every triggered signal and its points will be included in the result. The exact
thresholds and path rules are defined in [`brief.md`](./brief.md).

## Current Documentation

- [`brief.md`](./brief.md): decision-complete product and technical
  specification.
- [`brainstorming-project.md`](./brainstorming-project.md): alternatives,
  rationale, and scope exploration.
- [`journal.md`](./journal.md): factual record of AI assistance, decisions, and
  future verification results.

## Installation and Usage

Installation and usage instructions will be added only after the corresponding
commands have been implemented and verified. No package manifest or executable
application exists at this stage.

## Development Roadmap

1. Initialize the TypeScript frontend and backend workspaces.
2. Implement and test Git metadata acquisition.
3. Implement metrics and deterministic scoring.
4. Add text and Markdown CLI reports.
5. Expose the analyzer through the local Express API.
6. Build the React dashboard and error states.
7. Run linting, type checking, automated tests, and production builds.
8. Add verified setup instructions, screenshots, and presentation material.

## Planned Limitations

- Untracked files will not be included in v1.
- Binary files will be counted, but their changed lines cannot be measured.
- The analyzer will not execute project code or tests.
- It will not understand business semantics or guarantee the absence of
  regressions.
- GitHub Actions, Git hooks, configurable rules, persistent history, and AI
  integrations are post-MVP ideas.

## AI-Assisted Development

AI is being used to accelerate requirements analysis, implementation drafts,
debugging, and review. Suggestions will not be accepted blindly: prompts,
decisions, errors, corrections, and verification evidence will be recorded in
[`journal.md`](./journal.md).

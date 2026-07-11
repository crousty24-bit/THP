# Diff Impact Analyzer — Agent Guide

## Mission

Diff Impact Analyzer is a local, deterministic tool that measures the scope and
risk signals of unstaged or staged Git changes. It does not judge code quality,
prove that a regression exists, or use AI at runtime.

Keep changes scoped here and prefer small, verified MVP increments.

## Read Before Editing

Read only the material relevant to the task, starting with:

- `brief.md`: product contract, acceptance criteria, risk rules, and sensitive paths.
- `README.md`: implemented behavior and verified user commands.
- Latest entries in `journal.md`: prior decisions, failures, and test evidence.
- `shared/contracts.ts`: public data contract shared by backend and frontend.

The brief and shared contract take precedence over `docs/design/` references.

## Stack and Project Map

- Node.js 20.19+, TypeScript, npm workspaces, ESM.
- `backend/src/git.ts`: safe Git acquisition with `execFile`, never a shell.
- `backend/src/analyzer.ts`: report assembly and metrics.
- `backend/src/classifier.ts`: file types, domains, and sensitive paths.
- `backend/src/scoring.ts`: deterministic risk score and explanations.
- `backend/src/reports.ts`: text and Markdown rendering.
- `backend/src/cli.ts`: CLI arguments, stdout/stderr, and exit codes.
- `backend/src/app.ts` and `server.ts`: local Express API and server startup.
- `frontend/src/api.ts`: API boundary and runtime response validation.
- `frontend/src/App.tsx`: application state and analysis workflow.
- `frontend/src/components/`: presentational dashboard components.
- `backend/test/`: unit and real temporary-repository integration tests.
- `frontend/src/*.test.ts(x)`: API and React component tests.

## Public Contracts to Preserve

- CLI: `[--repo <path>] [--staged] [--format text|markdown]`.
- CLI reports go to stdout; errors go to stderr.
- CLI exit codes: `0` success, `1` Git/repository failure, `2` usage failure.
- API: `GET /api/repository` and `POST /api/analyze`.
- Analyze body: `{ "mode": "working" | "staged" }`.
- Server binds to `127.0.0.1`; the repository is fixed at startup.
- Development CORS is limited to the documented Vite origins.
- Untracked files remain excluded in v1, matching `git diff` behavior.
- Binary files count as changed files but have no line counts.
- No database, persistence, authentication, remote PR analysis, or AI calls.

If a public shape changes, update `shared/contracts.ts`, backend producers,
frontend validation/consumers, tests, `brief.md`, and `README.md` together.

## Risk Model Invariants

The score is transparent, deterministic, and capped at 100. It combines changed
line volume, file count, top-level domain spread, and explicit sensitive-path
categories. Sensitive-path points are capped at 40. Verdict thresholds and all
exact scoring values live in `brief.md` and `backend/src/scoring.ts`.

Never silently tune scoring thresholds. A scoring change requires rationale,
boundary tests, documentation updates, and a `journal.md` entry.

## Commands

Run from this directory:

```bash
npm install
npm run lint
npm run typecheck
TMPDIR=/tmp npm test
npm run build
```

Use `TMPDIR=/tmp` for Vitest under WSL when the inherited Windows temporary
directory causes socket errors. Run a focused workspace test while iterating,
then run all four checks before handoff.

Useful runtime commands:

```bash
npm run --silent analyze -- --repo /absolute/repository/path
npm run dev:backend -- --repo /absolute/repository/path
npm run dev:frontend
```

`npm run qa:browser` requires both services, staged changes in the analyzed
repository, and Chrome at `/usr/bin/google-chrome`. It rewrites files under
`docs/screenshots/`; run it only when validating UI behavior or updating visual
evidence deliberately.

## Implementation Conventions

- Follow the existing TypeScript ESM style and import conventions.
- Keep the analysis engine independent from Express, React, and output formats.
- Use `execFile` with argument arrays and NUL-delimited Git output; never build a
  shell command from repository paths or filenames.
- Preserve paths with spaces, renames, deletions, root files, and binary files.
- Keep summaries and signal ordering deterministic.
- Validate external JSON at the frontend boundary before rendering it.
- Prefer existing functions and types over parallel abstractions.
- Do not add a dependency unless the standard library or current stack cannot
  solve the requirement simply; document the reason when one is added.
- Do not edit generated `dist/`, coverage output, or `node_modules/`.

## Testing Rules

- Add or update tests with every behavior change or bug fix.
- Scoring: test both sides of every affected threshold and score cap.
- Git: use temporary repositories for staged, unstaged, empty, renamed, deleted,
  spaced-path, root-level, and binary cases.
- CLI: assert stdout, stderr, format, arguments, and exit codes.
- API: assert status, error shape, requested mode, and Git failures.
- React: assert initial, loading, success, empty, and error states through
  accessible roles and visible user behavior.
- Avoid snapshots when a focused semantic assertion is clearer.
- Never claim a check passed unless it was run in the current worktree.

## Documentation and Git Hygiene

- `README.md` must remain in English and describe only verified behavior.
- Keep `brief.md`, `brainstorming-project.md`, and `journal.md` in French.
- Record meaningful AI assistance, accepted/rejected proposals, failures, fixes,
  and actual verification in `journal.md`; do not present future work as done.
- Keep commits small, coherent, and written in English.
- Preserve unrelated user changes and inspect `git status` before editing.
- Do not commit screenshots unless browser QA intentionally regenerated them.

## Recommended Next Passes

In priority order, while preserving the stable core contract:

1. Centralize Express handling for malformed and oversized JSON bodies.
2. Strengthen browser QA business assertions and make the Chrome path configurable.
3. Add file/domain filtering without changing analysis results.
4. Add explicit text/Markdown file export.
5. Package the CLI so it can run conveniently from any local repository.

Git hooks, GitHub Actions, remote comparisons, configurable scoring, and AI
integrations remain post-MVP work unless the brief is deliberately revised.

## Agent Workflow

1. Inspect `git status`, the relevant code, contract, tests, and documentation.
2. State the verified gap and choose the smallest coherent change.
3. Implement without weakening the security or scoring invariants.
4. Run focused tests, then lint, typecheck, the full suite, and build.
5. Update documentation to match only what was implemented and verified.
6. Report facts, remaining uncertainty, and the next bounded improvement.

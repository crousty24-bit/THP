# Repository Guidelines

## Repository Role

This repository groups projects and exercises from the THP curriculum.
Treat each project as an independent deliverable unless the prompt explicitly says otherwise.

## Exercise Instructions

- Always follow the exercise brief provided in the first prompt for the project.
- Do not add features, stacks, dependencies, or abstractions that are not required by the brief.
- If the brief conflicts with existing local conventions, make the smallest reasonable choice and state the tradeoff.
- Keep changes scoped to the current project folder.

## Default Project Structure

By default, projects are simple static front-end exercises and should use:

```text
index.html
style.css
index.js
README.md
```

Use another structure only when:

- the exercise explicitly requests it;
- an existing project already uses a different local convention;
- the requested stack requires it, for example React, Vite, or another framework.

For existing projects, preserve the naming already in place. For example, if a project already uses `script.js`, keep that convention instead of renaming files.

## README Convention

- Every project `README.md` must be written in English.
- Keep README files practical: purpose, features, setup/configuration, run instructions, and structure when relevant.
- Do not document behavior that was not implemented and verified.

## API Keys And Local Config

- Do not hardcode secrets in tracked JavaScript unless the exercise explicitly requires it.
- Prefer ignored local config files such as `*-config.js` for static projects.
- Include an example config file when a local ignored config file is needed.
- Add ignored config files to the project-level `.gitignore`.

## Commits

- Commit by project: one coherent commit should correspond to one project or exercise.
- Avoid mixing unrelated projects in the same commit.
- Do not rewrite or revert user changes unless explicitly asked.

## Verification

- Run the smallest relevant checks for the project.
- For static projects, at minimum verify syntax and run the app locally when behavior depends on the browser.
- If an external API key, service, or network dependency prevents full verification, state the verified facts and the remaining uncertainty.

## Communication

- Be concise and evidence-based.
- Distinguish verified facts from hypotheses and unknowns.
- Prefer minimal targeted edits over broad refactors.

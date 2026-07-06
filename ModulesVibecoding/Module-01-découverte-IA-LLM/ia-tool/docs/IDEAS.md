# Ideas

## Brainstorming

The selected brainstorming direction is a unit test generator for developers.
During the ideation phase, the following related tool ideas were considered:

1. AI unit test generator
   - Analyzes source code and proposes unit tests for common cases, edge cases,
     and error paths.
2. Commit message assistant
   - Reads a diff and suggests a clear commit message following a chosen
     convention.
3. Pull request summary assistant
   - Produces a concise summary of the changes, risks, and verification steps
     for a pull request.
4. Code review checklist generator
   - Builds a targeted review checklist based on the files changed and the
     technologies used.
5. Bug reproduction helper
   - Turns a bug report into reproduction steps, likely causes, and minimal
     debugging checks.
6. Documentation draft assistant
   - Generates README sections, usage examples, and setup notes from a project
     structure.
7. API contract explainer
   - Reads endpoint definitions and explains expected inputs, outputs, errors,
     and examples.
8. Refactoring risk detector
   - Reviews a planned change and identifies behavior that could regress.
9. Test data generator
   - Creates realistic fixtures and sample payloads for tests.
10. Learning assistant for legacy code
    - Explains an unfamiliar module and maps the main execution flow.

## Chosen Idea

I chose the AI unit test generator.

This idea is useful because tests are both practical and educational. A good
test draft helps a developer understand what the code is supposed to do, where
the edge cases are, and which assumptions are still unclear. It also fits well
with an AI-assisted workflow: the AI can suggest coverage, but the developer
must still review the behavior, correct wrong assumptions, and decide what is
worth keeping.

The first version should stay focused: generate a small set of readable unit
test proposals from a function, class, or module, then explain the reasoning
behind each test.

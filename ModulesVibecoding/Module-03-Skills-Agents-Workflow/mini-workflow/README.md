# Mini Workflow: `sortNumbers`

## Purpose

This project demonstrates a simple AI-assisted workflow: define a small JavaScript feature, generate tests, implement the code, document the result, and analyze the process.

## Feature

The project provides a `sortNumbers` function that:

- accepts an array of numbers;
- returns a new array sorted in ascending numeric order;
- keeps the original array unchanged;
- supports empty arrays, negative numbers, decimals, and duplicates;
- throws a `TypeError` for invalid inputs.

## Run The Tests

From this project folder, run:

```bash
node sortNumbers.test.js
```

Expected output:

```text
All sortNumbers tests passed.
```

## Structure

```text
.
├── README.md
├── sortNumbers.js
├── sortNumbers.test.js
├── spec.md
└── workflows/
    ├── retour_experience.md
    └── sort_numbers_workflow.md
```

## Workflow Files

- `workflows/sort_numbers_workflow.md` documents the AI prompts and expected outputs for each step.
- `workflows/retour_experience.md` records what worked, what required iteration, and where human intervention was needed.


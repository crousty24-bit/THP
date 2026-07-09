# React Todo Starter

Small React application built with Vite for the THP React/JSX exercise.

## Features

- Loads five todos from the public JSONPlaceholder API.
- Stores API results in React state with `useState`.
- Fetches data on page load with `useEffect`.
- Handles loading and fetch errors.
- Adds new tasks locally with a controlled input.
- Toggles a task as completed by clicking the task row.
- Splits the UI into reusable `Header` and `TodoItem` components.

## API

The app uses:

```text
https://jsonplaceholder.typicode.com/todos?_limit=5
```

No backend was added for this exercise.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173/`.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## How AI Helped

AI was used to scaffold the Vite React project, create the component structure,
wire the API call, and suggest a simple CSS layout. The generated starter code
was reviewed and replaced with the exercise-specific todo app.

## Structure

```text
src/
  components/
    Header.jsx
    TodoItem.jsx
  App.jsx
  App.css
  index.css
  main.jsx
```

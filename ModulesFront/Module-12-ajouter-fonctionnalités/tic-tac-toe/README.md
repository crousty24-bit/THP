# The Hacking Morpion

Static tic-tac-toe game based on
[`TheHackingProject/tic-tac-toe-AI`](https://github.com/TheHackingProject/tic-tac-toe-AI).

## Features

- Play tic-tac-toe against an AI.
- Choose between three AI difficulty levels:
  - Beginner: random legal moves.
  - Intermediate: wins immediately when possible, otherwise blocks the player,
    otherwise plays randomly.
  - Advanced: minimax-based AI.
- Undo and redo moves one move at a time, including AI moves.
- Persist the current board, AI difficulty, game-over state, and status with
  `localStorage`.
- Restore a saved game after reloading the page.

## Run

Open `index.html` in a browser, or serve the folder with a local static server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/
```

## Persistence

The game stores its state under the `localStorage` key
`thp-tic-tac-toe-state`.

History is intentionally not restored after a page reload. After loading a saved
game, undo and redo stay disabled until new moves are played.

## Structure

```text
index.html
style.css
morpion.js
assets/
  circle.png
  cross.png
README.md
```

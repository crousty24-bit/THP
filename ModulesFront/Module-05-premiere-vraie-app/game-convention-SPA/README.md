# The Hyper Progame RAWG SPA

Webpack single page application for the THP RAWG game convention exercise.

## Features

- Lists upcoming games from RAWG with search, platform button filtering, and sorting.
- Reveals more games in batches of 9, up to 27 games.
- Opens detail pages through SPA routes such as `/game/the-witcher-3-wild-hunt`.
- Displays available game details, screenshots, trailer video, store links, and similar games.
- Includes a Masonry card layout on desktop and a dedicated screenshot gallery route.
- Opens screenshots in a keyboard-friendly lightbox viewer.
- Attempts card hover video previews when RAWG returns movie data.
- Uses SCSS variables and mixins with a responsive baseline.
- Keeps the RAWG API key in a local ignored config file.

## API Configuration

Copy the example config:

```bash
cp rawg-config.example.js rawg-config.js
```

Then add your RAWG key:

```js
window.RAWG_CONFIG = {
  apiKey: "YOUR_RAWG_API_KEY",
};
```

RAWG requires a key on every request. Get one from https://rawg.io/apidocs.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:8080/
```

## Build

```bash
npm run build
```

## Structure

```text
src/
  api/rawg.js
  components/game-card.js
  views/page-list.js
  views/page-detail.js
  views/page-screenshots.js
  router.js
  main.js
  styles/main.scss
  assets/logos/
```

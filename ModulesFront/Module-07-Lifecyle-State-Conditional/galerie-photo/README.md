# Unsplash Photo Gallery

React and Vite photo gallery for the THP lifecycle, state, and conditional rendering exercise.

## Features

- Searches Unsplash photos by keyword with `JavaScript` as the default query.
- Uses controlled React inputs for the search term and minimum image width.
- Displays matching photos in batches of 20 with a `See more` action.
- Filters displayed photos to images wider than the submitted minimum width.
- Shows the photographer name, Unsplash attribution link, and photo description.
- Opens a large image modal on photo click and closes it with the close button, backdrop, or Escape key.
- Handles loading, API errors, empty results, and missing API key states.

## API Configuration

Copy the example config:

```bash
cp unsplash-config.example.js unsplash-config.js
```

Then add your Unsplash access key:

```js
window.UNSPLASH_CONFIG = {
  apiKey: "YOUR_UNSPLASH_ACCESS_KEY",
};
```

Create an Unsplash developer app at https://unsplash.com/developers.

## Run Locally

```bash
pnpm install
pnpm run dev
```

Open the Vite URL shown in the terminal.

## Build

```bash
pnpm run build
```

## Structure

```text
src/
  App.jsx
  App.css
  index.css
  main.jsx
unsplash-config.example.js
```

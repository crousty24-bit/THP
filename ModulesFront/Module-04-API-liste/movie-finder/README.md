# Movie Finder OMDb

Static front-end application built with HTML, CSS, and JavaScript to search movies and series with the OMDb API.

## Features

- Searches movies and series by keywords.
- Displays results as cards with poster, title, year, type, and a `Read more` CTA.
- Reveals cards progressively on scroll with `IntersectionObserver`.
- Lazy-loads poster images.
- Detail modal with full plot, release date, genre, runtime, director, actors, and IMDb rating.
- Handles API errors, empty searches, and unavailable posters.

## API

- OMDb API: https://www.omdbapi.com/

Search requests use the `s` parameter.
Movie detail requests use the `i` parameter with `plot=full`.

## Configuration

Copy the example file:

```bash
cp omdb-config.example.js omdb-config.js
```

Then add your API key:

```js
window.OMDB_CONFIG = {
  apiKey: "YOUR_OMDB_API_KEY",
};
```

The `omdb-config.js` file is ignored by Git to avoid committing an API key.

## Run Locally

From this folder:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/
```

## Structure

```text
index.html
style.css
script.js
omdb-config.example.js
omdb-config.js
.gitignore
README.md
```

# Velib & Weather Paris

Small front-end application built with plain HTML, CSS, and JavaScript to display real-time data from public APIs.

## Features

- Displays available Velib stations around Paris.
- Shows mechanical bikes, electric bikes, free docks, and station capacity.
- Refreshes Velib data automatically every minute.
- Displays visible stations on a Leaflet map.
- Shows the current weather using Weatherbit.
- Allows searching weather data for another city.

## APIs Used

- Velib Paris Open Data: real-time bike station availability.
- Weatherbit Current Weather API: current weather data.
- Leaflet + CARTO basemaps: map display.

## Weatherbit Configuration

Weatherbit requires an API key.

Copy the example configuration file:

```bash
cp weatherbit-config.example.js weatherbit-config.js
```

Then add your API key in `weatherbit-config.js`:

```js
window.WEATHERBIT_CONFIG = {
  apiKey: "YOUR_WEATHERBIT_API_KEY",
};
```

The `weatherbit-config.js` file is ignored by Git to avoid committing an API key.

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
weatherbit-config.example.js
weatherbit-config.js
```

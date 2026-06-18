const API_URL =
  "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&rows=12";

const stationsList = document.querySelector("#stations-list");
const statusMessage = document.querySelector("#status-message");
const lastUpdate = document.querySelector("#last-update");
const toggleStationsButton = document.querySelector("#toggle-stations");
const weatherForm = document.querySelector("#weather-form");
const weatherCityInput = document.querySelector("#weather-city");
const weatherStatus = document.querySelector("#weather-status");
const weatherResult = document.querySelector("#weather-result");

const parisCenter = [48.8566, 2.3522];
const defaultVisibleStations = 4;
let map;
let markersLayer;
let allStationRecords = [];
let stationsExpanded = false;

const showVelibStation = (element, name, mechanicals, ebikes) => {
  const title = document.createElement("h3");
  title.textContent = name;

  const stats = document.createElement("div");
  stats.className = "station-stats";
  stats.append(
    createStationStat("Velibs classiques", mechanicals),
    createStationStat("Velibs electriques", ebikes)
  );

  element.append(title, stats);
};

const initMap = () => {
  map = L.map("map").setView(parisCenter, 12);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);

  markersLayer = L.featureGroup().addTo(map);
};

const formatTime = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

const getStatusClass = (value) => (value === "OUI" ? "" : "warning");

const createStationStat = (label, value) => {
  const stat = document.createElement("div");
  stat.className = "station-stat";

  const statLabel = document.createElement("span");
  statLabel.textContent = label;

  const statValue = document.createElement("strong");
  statValue.textContent = value;

  stat.append(statLabel, statValue);
  return stat;
};

const createStatusTag = (label, value, shouldUseStatusClass = true) => {
  const tag = document.createElement("span");
  tag.className = shouldUseStatusClass
    ? `status-tag ${getStatusClass(value)}`.trim()
    : "status-tag";
  tag.textContent = `${label} ${value ?? "?"}`;
  return tag;
};

const getWeatherApiKey = () => {
  const config = window.WEATHERBIT_CONFIG;
  return config?.apiKey?.trim() ?? "";
};

const buildWeatherUrl = (location) => {
  const url = new URL("https://api.weatherbit.io/v2.0/current");
  url.searchParams.set("key", getWeatherApiKey());
  url.searchParams.set("units", "M");
  url.searchParams.set("lang", "fr");

  if (location.city) {
    url.searchParams.set("city", location.city);
  } else {
    url.searchParams.set("lat", String(parisCenter[0]));
    url.searchParams.set("lon", String(parisCenter[1]));
  }

  return url;
};

const setWeatherStatus = (message, isError = false) => {
  weatherStatus.textContent = message;
  weatherStatus.classList.toggle("error-message", isError);
};

const renderWeatherError = (message) => {
  setWeatherStatus(message, true);
  weatherResult.innerHTML = "";
};

const createWeatherMetric = (label, value) => {
  const metric = document.createElement("div");
  metric.className = "weather-metric";

  const metricLabel = document.createElement("span");
  metricLabel.textContent = label;

  const metricValue = document.createElement("strong");
  metricValue.textContent = value;

  metric.append(metricLabel, metricValue);
  return metric;
};

const formatTemperature = (value) =>
  Number.isFinite(value) ? `${Math.round(value)}\u00B0C` : "?";

const renderWeather = (weatherData) => {
  weatherResult.innerHTML = "";

  const card = document.createElement("article");
  card.className = "weather-card";

  const heading = document.createElement("div");
  heading.className = "weather-card-heading";

  const city = document.createElement("h3");
  city.textContent = weatherData.city_name ?? "Ville inconnue";

  const description = document.createElement("p");
  description.textContent = weatherData.weather?.description ?? "Condition inconnue";

  heading.append(city, description);

  const temperature = document.createElement("strong");
  temperature.className = "weather-temperature";
  temperature.textContent = formatTemperature(weatherData.temp);

  const metrics = document.createElement("div");
  metrics.className = "weather-metrics";
  metrics.append(
    createWeatherMetric("Ressenti", formatTemperature(weatherData.app_temp)),
    createWeatherMetric("Humidite", `${weatherData.rh ?? "?"}%`),
    createWeatherMetric("Vent", `${weatherData.wind_spd ?? "?"} m/s`),
    createWeatherMetric("Observation", weatherData.ob_time ?? "?")
  );

  card.append(heading, temperature, metrics);
  weatherResult.appendChild(card);
  setWeatherStatus("Meteo actuelle chargee.");
};

const fetchWeather = async (location = {}) => {
  const apiKey = getWeatherApiKey();

  if (!apiKey) {
    renderWeatherError(
      "Cle Weatherbit manquante. Renseigne weatherbit-config.js pour activer la meteo."
    );
    return;
  }

  setWeatherStatus("Chargement de la meteo...");

  try {
    const response = await fetch(buildWeatherUrl(location));

    if (response.status === 204) {
      throw new Error("Aucune meteo trouvee pour cette ville.");
    }

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Cle Weatherbit invalide ou acces refuse.");
      }

      if (response.status === 429) {
        throw new Error("Quota Weatherbit depasse. Reessaie plus tard.");
      }

      throw new Error(`Erreur Weatherbit ${response.status}.`);
    }

    const data = await response.json();
    const weatherData = data.data?.[0];

    if (!weatherData) {
      throw new Error("Aucune meteo trouvee pour cette ville.");
    }

    renderWeather(weatherData);
  } catch (error) {
    renderWeatherError(error.message);
  }
};

const createStationCard = (fields) => {
  const card = document.createElement("article");
  card.className = "station-card";
  showVelibStation(card, fields.name, fields.mechanical ?? 0, fields.ebike ?? 0);

  const stats = card.querySelector(".station-stats");
  stats.appendChild(createStationStat("Docks libres", fields.numdocksavailable ?? 0));

  const meta = document.createElement("div");
  meta.className = "station-meta";
  meta.append(
    createStatusTag("Capacite", fields.capacity, false),
    createStatusTag("Location :", fields.is_renting),
    createStatusTag("Retour :", fields.is_returning)
  );

  card.appendChild(meta);
  return card;
};

const updateStationsToggle = () => {
  const hasMoreStations = allStationRecords.length > defaultVisibleStations;
  toggleStationsButton.hidden = !hasMoreStations;
  toggleStationsButton.setAttribute("aria-expanded", String(stationsExpanded));
  toggleStationsButton.textContent = stationsExpanded
    ? "Afficher moins de stations"
    : `Afficher toutes les stations (${allStationRecords.length})`;
};

const getVisibleStationRecords = () =>
  stationsExpanded
    ? allStationRecords
    : allStationRecords.slice(0, defaultVisibleStations);

const renderStationList = () => {
  stationsList.innerHTML = "";
  const recordsToDisplay = getVisibleStationRecords();

  recordsToDisplay.forEach((record) => {
    const fields = record.fields;
    stationsList.appendChild(createStationCard(fields));
  });

  updateStationsToggle();
};

const createMarkerPopup = (fields) => {
  const popup = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = fields.name;

  const mechanicals = document.createElement("div");
  mechanicals.textContent = `${fields.mechanical ?? 0} Velibs classiques`;

  const ebikes = document.createElement("div");
  ebikes.textContent = `${fields.ebike ?? 0} Velibs electriques`;

  const docks = document.createElement("div");
  docks.textContent = `${fields.numdocksavailable ?? 0} docks libres`;

  popup.append(title, mechanicals, ebikes, docks);
  return popup;
};

const renderMapMarkers = (records) => {
  markersLayer.clearLayers();

  records.forEach((record) => {
    const fields = record.fields;

    if (!Array.isArray(fields.coordonnees_geo)) return;

    const [lat, lon] = fields.coordonnees_geo;
    const marker = L.marker([lat, lon]).bindPopup(createMarkerPopup(fields));

    marker.addTo(markersLayer);
  });

  const markerBounds = markersLayer.getBounds();
  if (markerBounds.isValid()) {
    map.fitBounds(markerBounds, { padding: [28, 28], maxZoom: 14 });
  }
};

const renderStations = (records) => {
  allStationRecords = records;
  renderStationList();
  renderMapMarkers(getVisibleStationRecords());
};

const fetchStations = async () => {
  statusMessage.textContent = "Chargement des stations...";
  statusMessage.classList.remove("error-message");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.records)) {
      throw new Error("Format API inattendu : records est absent.");
    }

    renderStations(data.records);
    statusMessage.textContent = `${data.records.length} stations recuperees. Actualisation automatique chaque minute.`;
    lastUpdate.textContent = formatTime(new Date());
  } catch (error) {
    statusMessage.textContent =
      "Impossible de recuperer les stations Velib pour le moment.";
    statusMessage.classList.add("error-message");
    lastUpdate.textContent = "Erreur";
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  fetchStations();
  fetchWeather();
  setInterval(fetchStations, 60000);

  toggleStationsButton.addEventListener("click", () => {
    stationsExpanded = !stationsExpanded;
    renderStationList();
    renderMapMarkers(getVisibleStationRecords());
  });

  weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = weatherCityInput.value.trim();
    fetchWeather(city ? { city } : {});
  });
});

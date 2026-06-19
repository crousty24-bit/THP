const OMDB_BASE_URL = "https://www.omdbapi.com/";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const statusMessage = document.querySelector("#status-message");
const resultsGrid = document.querySelector("#results-grid");
const modal = document.querySelector("#movie-modal");
const modalPanel = document.querySelector(".modal-panel");
const modalContent = document.querySelector("#modal-content");
const modalCloseButton = document.querySelector("#modal-close");

let movieObserver;
let lastFocusedElement = null;

const getApiKey = () => window.OMDB_CONFIG?.apiKey?.trim() ?? "";

const setStatus = (message, isError = false) => {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error-message", isError);
};

const formatValue = (value) => {
  if (!value || value === "N/A") return "Non renseigne";
  return value;
};

const buildOmdbUrl = (params) => {
  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", getApiKey());

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url;
};

const ensureApiKey = () => {
  if (!getApiKey()) {
    throw new Error("Cle OMDb manquante. Renseigne omdb-config.js pour activer la recherche.");
  }
};

const fetchOmdb = async (params) => {
  ensureApiKey();

  const response = await fetch(buildOmdbUrl(params));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Cle OMDb invalide ou acces refuse.");
    }

    if (response.status === 429) {
      throw new Error("Quota OMDb depasse. Reessaie plus tard.");
    }

    throw new Error(`Erreur HTTP ${response.status}.`);
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error ?? "Aucun resultat trouve.");
  }

  return data;
};

const fetchSearchResults = async (query) => {
  const data = await fetchOmdb({ s: query });
  return Array.isArray(data.Search) ? data.Search : [];
};

const fetchMovieDetails = async (imdbID) =>
  fetchOmdb({
    i: imdbID,
    plot: "full",
  });

const createPoster = (posterUrl, title) => {
  const frame = document.createElement("div");
  frame.className = "poster-frame";

  if (!posterUrl || posterUrl === "N/A") {
    const placeholder = document.createElement("div");
    placeholder.className = "poster-placeholder";
    placeholder.textContent = "Affiche indisponible";
    frame.appendChild(placeholder);
    return frame;
  }

  const poster = document.createElement("img");
  poster.src = posterUrl;
  poster.alt = `Affiche de ${title}`;
  poster.loading = "lazy";
  frame.appendChild(poster);
  return frame;
};

const createMetaTag = (value) => {
  const tag = document.createElement("span");
  tag.textContent = formatValue(value);
  return tag;
};

const revealMovieCards = () => {
  if (movieObserver) {
    movieObserver.disconnect();
  }

  movieObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px",
    }
  );

  document.querySelectorAll(".movie-card").forEach((card) => {
    movieObserver.observe(card);
  });
};

const createMovieCard = (movie) => {
  const card = document.createElement("article");
  card.className = "movie-card";

  const content = document.createElement("div");
  content.className = "movie-content";

  const copy = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = formatValue(movie.Title);

  const meta = document.createElement("p");
  meta.className = "movie-meta";
  meta.append(createMetaTag(movie.Year), createMetaTag(movie.Type));

  copy.append(title, meta);

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Read more";
  button.dataset.imdbId = movie.imdbID;
  button.addEventListener("click", () => openMovieDetails(movie.imdbID, button));

  content.append(copy, button);
  card.append(createPoster(movie.Poster, movie.Title), content);
  return card;
};

const renderMovies = (movies) => {
  resultsGrid.innerHTML = "";

  movies.forEach((movie) => {
    resultsGrid.appendChild(createMovieCard(movie));
  });

  revealMovieCards();
};

const renderEmptyResults = (message) => {
  resultsGrid.innerHTML = "";
  setStatus(message, true);
};

const setSearchLoading = (isLoading) => {
  searchButton.disabled = isLoading;
  searchInput.disabled = isLoading;
  searchButton.textContent = isLoading ? "Recherche..." : "Rechercher";
};

const setReadMoreLoading = (button, isLoading) => {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Chargement..." : "Read more";
};

const createDetailField = (label, value) => {
  const field = document.createElement("div");
  field.className = "detail-field";

  const fieldLabel = document.createElement("strong");
  fieldLabel.textContent = label;

  const fieldValue = document.createElement("p");
  fieldValue.textContent = formatValue(value);

  field.append(fieldLabel, fieldValue);
  return field;
};

const renderMovieDetails = (movie) => {
  modalContent.innerHTML = "";

  const detail = document.createElement("div");
  detail.className = "movie-detail";

  const copy = document.createElement("div");
  copy.className = "detail-copy";

  const title = document.createElement("h2");
  title.id = "modal-title";
  title.textContent = formatValue(movie.Title);

  const detailList = document.createElement("div");
  detailList.className = "detail-list";
  detailList.append(
    createMetaTag(movie.Released),
    createMetaTag(movie.Genre),
    createMetaTag(movie.Runtime),
    createMetaTag(`IMDb ${formatValue(movie.imdbRating)}`)
  );

  copy.append(
    title,
    detailList,
    createDetailField("Resume", movie.Plot),
    createDetailField("Realisateur", movie.Director),
    createDetailField("Acteurs", movie.Actors)
  );

  detail.append(createPoster(movie.Poster, movie.Title), copy);
  modalContent.appendChild(detail);
};

const closeModal = () => {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  modalContent.innerHTML = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

const openModal = () => {
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalPanel.focus();
};

const openMovieDetails = async (imdbID, button) => {
  lastFocusedElement = button;
  setReadMoreLoading(button, true);

  try {
    const movie = await fetchMovieDetails(imdbID);
    renderMovieDetails(movie);
    openModal();
  } catch (error) {
    setStatus(`Impossible de charger la fiche : ${error.message}`, true);
  } finally {
    setReadMoreLoading(button, false);
  }
};

const handleSearchSubmit = async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    renderEmptyResults("Entre un titre avant de lancer la recherche.");
    searchInput.focus();
    return;
  }

  setSearchLoading(true);
  setStatus("Recherche en cours...");
  resultsGrid.innerHTML = "";

  try {
    const movies = await fetchSearchResults(query);

    if (movies.length === 0) {
      renderEmptyResults("Aucun resultat trouve.");
      return;
    }

    renderMovies(movies);
    setStatus(`${movies.length} resultat(s) trouve(s) pour "${query}".`);
  } catch (error) {
    renderEmptyResults(error.message);
  } finally {
    setSearchLoading(false);
  }
};

searchForm.addEventListener("submit", handleSearchSubmit);
modalCloseButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});

import searchIcon from "../assets/logos/search.svg";
import Masonry from "masonry-layout";
import { PLATFORM_OPTIONS, SORT_OPTIONS, fetchGames } from "../api/rawg";
import { escapeHtml, renderStatus } from "../dom";
import { createGameCard } from "../components/game-card";

const INITIAL_VISIBLE_COUNT = 9;
const VISIBLE_STEP = 9;
const MAX_VISIBLE_COUNT = 27;

const introCopy =
  "The Hyper Progame is the world's premier event for computer and video games and related products. At The Hyper Progame, the video game industry's top talent pack the Los Angeles Convention Center, connecting tens of thousands of the best, brightest, and most innovative in the interactive entertainment industry. For three exciting days, leading-edge companies, groundbreaking new technologies, and never-before-seen products will be showcased. The Hyper Progame connects you with both new and existing partners, industry executives, gamers, and social influencers providing unprecedented exposure.";

const getPlatformLabel = (filters) => {
  if (filters.platformName) return filters.platformName;
  const platform = PLATFORM_OPTIONS.find((option) => option.value === filters.platform);
  return platform?.label ?? "Any";
};

const getListHeading = (filters) => {
  if (filters.search) return `Search results for "${filters.search}"`;
  if (filters.genre) return `Games tagged as ${filters.genre}`;
  if (filters.tag) return `Games tagged as ${filters.tag}`;
  if (filters.developer) return `Games by ${filters.developer}`;
  if (filters.publisher) return `Games published by ${filters.publisher}`;
  if (filters.platform || filters.platformId) return `Latest games on ${getPlatformLabel(filters)}`;
  return "Welcome,";
};

const buildListUrl = (nextFilters) => {
  const params = new URLSearchParams();

  Object.entries(nextFilters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const query = params.toString();
  return query ? `/?${query}` : "/";
};

const withoutExactPlatform = (filters) => {
  const nextFilters = { ...filters };
  delete nextFilters.platformId;
  delete nextFilters.platformName;
  return nextFilters;
};

const renderPlatformButtons = (activeValue) =>
  PLATFORM_OPTIONS.map(
    (platform) => `
      <button
        class="platform-toolbar__button"
        type="button"
        data-platform="${escapeHtml(platform.value)}"
        aria-pressed="${platform.value === activeValue ? "true" : "false"}"
      >
        ${escapeHtml(platform.label)}
      </button>
    `
  ).join("");

const renderSortButtons = (activeOrdering) =>
  SORT_OPTIONS.map(
    (sort) => `
      <button
        class="sort-toolbar__button"
        type="button"
        data-ordering="${escapeHtml(sort.value)}"
        aria-pressed="${sort.value === activeOrdering ? "true" : "false"}"
      >
        ${escapeHtml(sort.label)}
      </button>
    `
  ).join("");

const renderListShell = (root, filters) => {
  root.innerHTML = `
    <header class="site-header">
      <a href="#/" class="brand" data-route>The Hyper Progame</a>
      <form class="search-form" id="search-form" role="search">
        <label class="sr-only" for="search-input">Find a game</label>
        <img src="${searchIcon}" alt="" aria-hidden="true" />
        <input
          id="search-input"
          name="search"
          type="search"
          value="${escapeHtml(filters.search ?? "")}"
          placeholder="Find a game..."
          autocomplete="off"
        />
      </form>
    </header>

    <main class="page page-list">
      <section class="intro-section" aria-labelledby="list-title">
        <h1 id="list-title">${escapeHtml(getListHeading(filters))}</h1>
        <p>${escapeHtml(introCopy)}</p>
      </section>

      <section class="toolbar-section" aria-label="Game filters">
        <div class="platform-toolbar" aria-label="Filter by platform">
          <span>Platform :</span>
          <div class="platform-toolbar__buttons">
            ${renderPlatformButtons(filters.platform ?? "")}
          </div>
        </div>
        <div class="sort-toolbar" aria-label="Sort games">
          <span>Sort :</span>
          <div class="sort-toolbar__buttons">
            ${renderSortButtons(filters.ordering ?? "-added")}
          </div>
        </div>
      </section>

      <section id="list-state" class="list-state">
        ${renderStatus("Loading games", "Fetching RAWG data...")}
      </section>
    </main>

    <footer class="site-footer">
      <span></span>
      <p>Your Name @ 2020 - Fictionnal website for exercice</p>
      <a href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">Data from RAWG</a>
    </footer>
  `;

  root.querySelector("#search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") ?? "").trim();
    window.appRouter.navigate(buildListUrl({ ...filters, search }));
  });

  root.querySelectorAll("[data-platform]").forEach((button) => {
    button.addEventListener("click", () => {
      window.appRouter.navigate(
        buildListUrl({
          ...withoutExactPlatform(filters),
          platform: button.dataset.platform,
        })
      );
    });
  });

  root.querySelectorAll("[data-ordering]").forEach((button) => {
    button.addEventListener("click", () => {
      window.appRouter.navigate(buildListUrl({ ...filters, ordering: button.dataset.ordering }));
    });
  });
};

const initializeMasonry = (grid) => {
  if (!window.matchMedia("(min-width: 721px)").matches) return null;

  grid.classList.add("games-grid--masonry");
  const masonry = new Masonry(grid, {
    itemSelector: ".game-card",
    columnWidth: ".game-card",
    gutter: 32,
    percentPosition: true,
    transitionDuration: "180ms",
  });

  grid.querySelectorAll("img").forEach((image) => {
    if (image.complete) return;
    image.addEventListener("load", () => masonry.layout(), { once: true });
    image.addEventListener("error", () => masonry.layout(), { once: true });
  });

  return masonry;
};

const relayoutAfterImageLoad = (cards, masonry) => {
  if (!masonry) return;

  cards.forEach((card) => {
    card.querySelectorAll("img").forEach((image) => {
      if (image.complete) return;
      image.addEventListener("load", () => masonry.layout(), { once: true });
      image.addEventListener("error", () => masonry.layout(), { once: true });
    });
  });
};

const renderGames = (container, games) => {
  let visibleCount = INITIAL_VISIBLE_COUNT;
  let renderedCount = 0;
  let masonry = null;

  const grid = document.createElement("div");
  grid.className = "games-grid";

  const showMoreWrapper = document.createElement("div");
  showMoreWrapper.className = "show-more-row";

  const renderBatch = () => {
    const newCards = games.slice(renderedCount, visibleCount).map(createGameCard);
    newCards.forEach((card) => grid.appendChild(card));
    renderedCount = visibleCount;

    if (!masonry) {
      masonry = initializeMasonry(grid);
    } else if (newCards.length) {
      masonry.appended(newCards);
      relayoutAfterImageLoad(newCards, masonry);
      masonry.layout();
    }

    showMoreWrapper.innerHTML = "";
    if (visibleCount < Math.min(games.length, MAX_VISIBLE_COUNT)) {
      const button = document.createElement("button");
      button.className = "show-more-button";
      button.type = "button";
      button.textContent = "Show more";
      button.addEventListener("click", () => {
        visibleCount = Math.min(visibleCount + VISIBLE_STEP, MAX_VISIBLE_COUNT, games.length);
        renderBatch();
        masonry?.layout();
      });
      showMoreWrapper.appendChild(button);
    }
  };

  container.innerHTML = "";
  container.append(grid, showMoreWrapper);
  renderBatch();
};

export const renderPageList = async ({ root, filters }) => {
  renderListShell(root, filters);
  const listState = root.querySelector("#list-state");

  try {
    const payload = await fetchGames(filters);

    if (payload.results.length === 0) {
      listState.innerHTML = renderStatus(
        "No games found",
        "Try another search or remove the platform filter.",
        true
      );
      return;
    }

    renderGames(listState, payload.results);
  } catch (error) {
    listState.innerHTML = renderStatus("Unable to load games", error.message, true);
  }
};

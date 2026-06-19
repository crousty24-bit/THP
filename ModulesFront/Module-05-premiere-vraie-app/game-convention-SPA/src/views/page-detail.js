import searchIcon from "../assets/logos/search.svg";
import {
  fetchGameDetail,
  fetchGameMovies,
  fetchGameScreenshots,
  fetchGameStores,
  fetchSimilarGames,
} from "../api/rawg";
import {
  commaList,
  escapeHtml,
  firstSentence,
  formatDate,
  formatRating,
  linkToFilter,
  linkToPlatform,
  renderTextBlocks,
  renderStatus,
} from "../dom";
import { createGameCard } from "../components/game-card";

const linkList = (type, items) => {
  if (!items.length) return "";

  return items
    .map(
      (item) => `
        <a class="internal-link" href="${type === "platform" ? linkToPlatform(item) : linkToFilter(type, item)}" data-route>
          ${escapeHtml(item.name)}
        </a>
      `
    )
    .join(", ");
};

const detailField = (label, content) => {
  if (!content) return "";

  return `
    <div class="detail-field">
      <dt>${escapeHtml(label)}</dt>
      <dd>${content}</dd>
    </div>
  `;
};

const renderHeader = (root, game = null) => {
  root.innerHTML = `
    <header class="site-header site-header--detail">
      <a href="/" class="brand" data-route>The Hyper Progame</a>
      <form class="search-form" id="detail-search-form" role="search">
        <label class="sr-only" for="detail-search-input">Find a game</label>
        <img src="${searchIcon}" alt="" aria-hidden="true" />
        <input
          id="detail-search-input"
          name="search"
          type="search"
          placeholder="Find a game..."
          autocomplete="off"
        />
      </form>
    </header>

    <main id="detail-root" class="page page-detail">
      ${
        game
          ? ""
          : renderStatus("Loading game", "Fetching RAWG detail data...")
      }
    </main>

    <footer class="site-footer">
      <span></span>
      <p>Your Name @ 2020 - Fictionnal website for exercice</p>
      <a href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">Data from RAWG</a>
    </footer>
  `;

  root.querySelector("#detail-search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") ?? "").trim();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    window.appRouter.navigate(params.toString() ? `/?${params.toString()}` : "/");
  });
};

const renderStores = (stores) => {
  if (!stores.length) return "";

  return `
    <section class="detail-section detail-section--buy" aria-labelledby="buy-title">
      <h2 id="buy-title">BUY</h2>
      <ul class="link-list">
        ${stores
          .map(
            (store) => `
              <li>
                <a href="${escapeHtml(store.url)}" target="_blank" rel="noreferrer">
                  ${escapeHtml(store.name)}
                </a>
              </li>
            `
          )
          .join("")}
      </ul>
    </section>
  `;
};

const renderTrailer = (movies) => {
  const movie = movies[0];
  if (!movie) return "";

  return `
    <section class="detail-section" aria-labelledby="trailer-title">
      <h2 id="trailer-title">TRAILER</h2>
      <video
        class="trailer-player"
        controls
        preload="metadata"
        poster="${escapeHtml(movie.preview)}"
      >
        <source src="${escapeHtml(movie.video)}" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  `;
};

const renderScreenshots = (game, screenshots) => {
  if (!screenshots.length) return "";

  return `
    <section class="detail-section" aria-labelledby="screenshots-title">
      <div class="section-title-row">
        <h2 id="screenshots-title">SCREENSHOTS</h2>
        <a class="internal-link section-link" href="/game/${encodeURIComponent(game.slug)}/screenshots" data-route>
          View all screenshots
        </a>
      </div>
      <div class="screenshots-grid">
        ${screenshots
          .map(
            (screenshot) => `
              <img
                src="${escapeHtml(screenshot.image)}"
                alt="Game screenshot"
                loading="lazy"
              />
            `
          )
          .join("")}
      </div>
    </section>
  `;
};

const renderSimilar = (games) => {
  const gamesWithImages = games.filter((game) => game.backgroundImage);
  if (!gamesWithImages.length) return "";

  const grid = document.createElement("div");
  grid.className = "games-grid games-grid--compact";
  gamesWithImages.forEach((game) => grid.appendChild(createGameCard(game)));

  return `
    <section class="detail-section" aria-labelledby="similar-title">
      <h2 id="similar-title">SIMILAR GAMES</h2>
      ${grid.outerHTML}
    </section>
  `;
};

const renderDetail = ({ game, stores, movies, screenshots, similarGames }) => `
  <section class="detail-hero" aria-label="${escapeHtml(game.name)} presentation">
    ${
      game.backgroundImage
        ? `<img src="${escapeHtml(game.backgroundImage)}" alt="${escapeHtml(game.name)} artwork" />`
        : ""
    }
    ${
      game.website
        ? `
          <a class="website-button" href="${escapeHtml(game.website)}" target="_blank" rel="noreferrer">
            Check Website
            <span aria-hidden="true"></span>
          </a>
        `
        : ""
    }
  </section>

  <section class="detail-overview" aria-labelledby="game-title">
    <div>
      <h1 id="game-title">${escapeHtml(game.name)},</h1>
      ${firstSentence(game.description) ? `<p class="lead">${escapeHtml(firstSentence(game.description))}</p>` : ""}
    </div>
    <p class="rating-line">${escapeHtml(formatRating(game.rating, game.ratingTop))} - ${escapeHtml(game.ratingsCount)} votes</p>
  </section>

  ${game.description ? `<article class="game-description">${renderTextBlocks(game.description)}</article>` : ""}

  <dl class="detail-meta">
    ${detailField("Release Date", escapeHtml(formatDate(game.released)))}
    ${detailField("Developer", linkList("developer", game.developers))}
    ${detailField("Platforms", linkList("platform", game.platforms))}
    ${detailField("Publisher", linkList("publisher", game.publishers))}
    ${detailField("Genre", linkList("genre", game.genres))}
    ${detailField("Tags", linkList("tag", game.tags.slice(0, 8)))}
  </dl>

  ${renderStores(stores)}
  ${renderTrailer(movies)}
  ${renderScreenshots(game, screenshots)}
  ${renderSimilar(similarGames)}
`;

export const renderPageDetail = async ({ root, slug }) => {
  renderHeader(root);
  const detailRoot = root.querySelector("#detail-root");

  try {
    const game = await fetchGameDetail(slug);
    renderHeader(root, game);

    const [stores, movies, screenshots, similarGames] = await Promise.all([
      fetchGameStores(game.slug).catch(() => []),
      fetchGameMovies(game.slug).catch(() => []),
      fetchGameScreenshots(game.slug).catch(() => []),
      fetchSimilarGames(game).catch(() => []),
    ]);

    root.querySelector("#detail-root").innerHTML = renderDetail({
      game,
      stores,
      movies,
      screenshots,
      similarGames,
    });
  } catch (error) {
    detailRoot.innerHTML = renderStatus("Unable to load this game", error.message, true);
  }
};

import searchIcon from "../assets/logos/search.svg";
import { fetchGameDetail, fetchGameScreenshots } from "../api/rawg";
import { escapeHtml, renderStatus, routeUrl } from "../dom";

const SCREENSHOTS_PAGE_SIZE = 40;

const renderHeader = (root) => {
  root.innerHTML = `
    <header class="site-header site-header--detail">
      <a href="#/" class="brand" data-route>The Hyper Progame</a>
      <form class="search-form" id="screenshots-search-form" role="search">
        <label class="sr-only" for="screenshots-search-input">Find a game</label>
        <img src="${searchIcon}" alt="" aria-hidden="true" />
        <input
          id="screenshots-search-input"
          name="search"
          type="search"
          placeholder="Find a game..."
          autocomplete="off"
        />
      </form>
    </header>

    <main id="screenshots-root" class="page screenshots-page">
      ${renderStatus("Loading screenshots", "Fetching RAWG screenshot data...")}
    </main>

    <footer class="site-footer">
      <span></span>
      <p>Your Name @ 2020 - Fictionnal website for exercice</p>
      <a href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">Data from RAWG</a>
    </footer>
  `;

  root.querySelector("#screenshots-search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") ?? "").trim();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    window.appRouter.navigate(params.toString() ? `/?${params.toString()}` : "/");
  });
};

const renderGallery = (game, screenshots) => `
  <section class="screenshots-heading">
    <nav aria-label="Breadcrumb">
      <a class="internal-link" href="#/" data-route>Games</a>
      <span>/</span>
      <a class="internal-link" href="${routeUrl(`/game/${encodeURIComponent(game.slug)}`)}" data-route>${escapeHtml(game.name)}</a>
      <span>/</span>
      <span>Screenshots</span>
    </nav>
    <h1>${escapeHtml(game.name)} screenshots</h1>
    <p>${screenshots.length} screenshots loaded from RAWG. Page 1</p>
  </section>

  <section class="screenshots-gallery" aria-label="${escapeHtml(game.name)} screenshots">
    ${screenshots
      .map(
        (screenshot, index) => `
          <button class="screenshot-tile" type="button" data-screenshot-index="${index}">
            <img src="${escapeHtml(screenshot.image)}" alt="${escapeHtml(game.name)} screenshot ${index + 1}" loading="lazy" />
          </button>
        `
      )
      .join("")}
  </section>

  <div id="screenshot-lightbox" class="screenshot-lightbox" role="dialog" aria-modal="true" aria-label="Screenshot viewer" hidden>
    <div class="screenshot-lightbox__backdrop" data-close-lightbox></div>
    <div class="screenshot-lightbox__panel">
      <button class="screenshot-lightbox__close" type="button" data-close-lightbox aria-label="Close screenshots viewer">Close</button>
      <button class="screenshot-lightbox__nav screenshot-lightbox__nav--prev" type="button" data-lightbox-prev aria-label="Previous screenshot">Prev</button>
      <img alt="" />
      <button class="screenshot-lightbox__nav screenshot-lightbox__nav--next" type="button" data-lightbox-next aria-label="Next screenshot">Next</button>
      <p class="screenshot-lightbox__count"></p>
    </div>
  </div>
`;

const attachLightbox = (root, game, screenshots) => {
  const lightbox = root.querySelector("#screenshot-lightbox");
  const image = lightbox.querySelector("img");
  const counter = lightbox.querySelector(".screenshot-lightbox__count");
  const closeButton = lightbox.querySelector(".screenshot-lightbox__close");
  let activeIndex = 0;
  let lastFocusedElement = null;
  let keydownHandler = null;

  const showImage = (index) => {
    activeIndex = (index + screenshots.length) % screenshots.length;
    const screenshot = screenshots[activeIndex];
    image.src = screenshot.image;
    image.alt = `${game.name} screenshot ${activeIndex + 1}`;
    counter.textContent = `${activeIndex + 1} / ${screenshots.length}`;
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    document.removeEventListener("keydown", keydownHandler);
    lastFocusedElement?.focus();
  };

  const open = (index, trigger) => {
    lastFocusedElement = trigger;
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();

    keydownHandler = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showImage(activeIndex - 1);
      if (event.key === "ArrowRight") showImage(activeIndex + 1);
    };
    document.addEventListener("keydown", keydownHandler);
  };

  root.querySelectorAll("[data-screenshot-index]").forEach((button) => {
    button.addEventListener("click", () => {
      open(Number(button.dataset.screenshotIndex), button);
    });
  });

  lightbox.querySelectorAll("[data-close-lightbox]").forEach((button) => {
    button.addEventListener("click", close);
  });

  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => {
    showImage(activeIndex - 1);
  });

  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => {
    showImage(activeIndex + 1);
  });
};

export const renderScreenshotsPage = async ({ root, slug }) => {
  renderHeader(root);
  const screenshotsRoot = root.querySelector("#screenshots-root");

  try {
    const [game, screenshots] = await Promise.all([
      fetchGameDetail(slug),
      fetchGameScreenshots(slug, SCREENSHOTS_PAGE_SIZE),
    ]);

    if (!screenshots.length) {
      screenshotsRoot.innerHTML = renderStatus(
        "No screenshots found",
        "RAWG did not return screenshots for this game.",
        true
      );
      return;
    }

    screenshotsRoot.innerHTML = renderGallery(game, screenshots);
    attachLightbox(screenshotsRoot, game, screenshots);
  } catch (error) {
    screenshotsRoot.innerHTML = renderStatus("Unable to load screenshots", error.message, true);
  }
};

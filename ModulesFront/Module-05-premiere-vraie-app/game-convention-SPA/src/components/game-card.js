import linuxIcon from "../assets/logos/linux.svg";
import mobileIcon from "../assets/logos/mobile.svg";
import ps4Icon from "../assets/logos/ps4.svg";
import switchIcon from "../assets/logos/switch.svg";
import windowsIcon from "../assets/logos/windows.svg";
import xboxIcon from "../assets/logos/xbox.svg";
import { fetchGameMovies } from "../api/rawg";
import { commaList, escapeHtml, formatDate, formatRating } from "../dom";

const moviePreviewCache = new Map();

export const platformIcons = {
  pc: windowsIcon,
  playstation: ps4Icon,
  xbox: xboxIcon,
  ios: mobileIcon,
  android: mobileIcon,
  mac: linuxIcon,
  linux: linuxIcon,
  nintendo: switchIcon,
};

const platformIconFor = (platform) => {
  const slug = platform.slug?.toLowerCase() ?? "";

  if (slug.includes("playstation") || slug.includes("ps")) return ps4Icon;
  if (slug.includes("xbox")) return xboxIcon;
  if (slug.includes("nintendo") || slug.includes("switch")) return switchIcon;
  if (slug.includes("ios") || slug.includes("android")) return mobileIcon;
  if (slug.includes("linux")) return linuxIcon;
  if (slug.includes("mac")) return linuxIcon;
  if (slug.includes("pc") || slug.includes("windows")) return windowsIcon;

  return null;
};

export const renderPlatformIcons = (platforms) => {
  const uniqueIcons = [];

  platforms.forEach((platform) => {
    const icon = platformIconFor(platform);
    if (icon && !uniqueIcons.includes(icon)) {
      uniqueIcons.push(icon);
    }
  });

  if (uniqueIcons.length === 0) return "";

  return `
    <ul class="platform-icons" aria-label="Available platforms">
      ${uniqueIcons
        .map(
          (icon) => `
            <li>
              <img src="${icon}" alt="" aria-hidden="true" />
            </li>
          `
        )
        .join("")}
    </ul>
  `;
};

export const createGameCard = (game) => {
  const article = document.createElement("article");
  article.className = "game-card";

  const image = game.backgroundImage
    ? `<img src="${escapeHtml(game.backgroundImage)}" alt="${escapeHtml(game.name)} artwork" loading="lazy" />`
    : `<div class="game-card__placeholder">Artwork pending</div>`;

  const extraLine = commaList(game.publishers) || commaList(game.developers);

  article.innerHTML = `
    <a class="game-card__link" href="/game/${encodeURIComponent(game.slug)}" data-route>
      <div class="game-card__media">
        ${image}
        <div class="game-card__video-slot" aria-hidden="true"></div>
        <div class="game-card__hover">
          <p>${escapeHtml(formatDate(game.released))}</p>
          ${extraLine ? `<p>${escapeHtml(extraLine)}</p>` : ""}
          ${game.genres.length ? `<p>${escapeHtml(commaList(game.genres))}</p>` : ""}
          <p>${escapeHtml(formatRating(game.rating, game.ratingTop))} - ${escapeHtml(game.ratingsCount)} votes</p>
        </div>
      </div>
      <h3>${escapeHtml(game.name)}</h3>
      ${renderPlatformIcons(game.platforms)}
    </a>
  `;

  attachHoverPreview(article, game.slug);

  return article;
};

const attachHoverPreview = (card, slug) => {
  const media = card.querySelector(".game-card__media");
  const videoSlot = card.querySelector(".game-card__video-slot");
  let hoverTimer = null;

  const loadPreview = async () => {
    if (!slug || card.dataset.previewStatus === "empty") return;

    if (!moviePreviewCache.has(slug)) {
      moviePreviewCache.set(
        slug,
        fetchGameMovies(slug)
          .then((movies) => movies[0] ?? null)
          .catch(() => null)
      );
    }

    const movie = await moviePreviewCache.get(slug);
    if (!movie?.video || !card.isConnected) {
      card.dataset.previewStatus = "empty";
      return;
    }

    if (!videoSlot.querySelector("video")) {
      videoSlot.innerHTML = `
        <video muted loop playsinline preload="metadata" poster="${escapeHtml(movie.preview)}">
          <source src="${escapeHtml(movie.video)}" type="video/mp4" />
        </video>
      `;
    }

    card.dataset.previewStatus = "ready";
    if (card.matches(":hover") || card.matches(":focus-within")) {
      videoSlot.querySelector("video")?.play().catch(() => {});
    }
  };

  const enter = () => {
    window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(loadPreview, 380);
  };

  const leave = () => {
    window.clearTimeout(hoverTimer);
    media.querySelector("video")?.pause();
  };

  card.addEventListener("mouseenter", enter);
  card.addEventListener("focusin", enter);
  card.addEventListener("mouseleave", leave);
  card.addEventListener("focusout", leave);
};

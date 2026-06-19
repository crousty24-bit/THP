const RAWG_BASE_URL = "https://api.rawg.io/api";
const UPCOMING_DAYS = 365;
const LIST_PAGE_SIZE = 27;

export const PLATFORM_OPTIONS = [
  { label: "Any", value: "", parentId: "", icon: null },
  { label: "PC", value: "pc", parentId: "1", icon: "windows" },
  { label: "PS4", value: "playstation", parentId: "2", icon: "ps4" },
  { label: "Xbox", value: "xbox", parentId: "3", icon: "xbox" },
  { label: "Switch", value: "nintendo", parentId: "7", icon: "switch" },
  { label: "iOS", value: "ios", parentId: "4", icon: "mobile" },
  { label: "Android", value: "android", parentId: "8", icon: "mobile" },
  { label: "Linux", value: "linux", parentId: "6", icon: "linux" },
];

export const SORT_OPTIONS = [
  { label: "Popularity", value: "-added" },
  { label: "Name", value: "name" },
  { label: "Release Date", value: "-released" },
  { label: "Average rating", value: "-rating" },
];

export class RawgApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "RawgApiError";
    this.status = status;
  }
}

export const getRawgApiKey = () => window.RAWG_CONFIG?.apiKey?.trim() ?? "";

const ensureApiKey = () => {
  if (!getRawgApiKey() || getRawgApiKey() === "YOUR_RAWG_API_KEY") {
    throw new RawgApiError(
      "RAWG API key is missing. Create rawg-config.js from rawg-config.example.js."
    );
  }
};

const toIsoDate = (date) => date.toISOString().slice(0, 10);

export const getUpcomingDateRange = () => {
  const start = new Date();
  const end = new Date(start);
  end.setDate(start.getDate() + UPCOMING_DAYS);
  return `${toIsoDate(start)},${toIsoDate(end)}`;
};

const buildUrl = (path, params = {}) => {
  ensureApiKey();

  const url = new URL(`${RAWG_BASE_URL}${path}`);
  url.searchParams.set("key", getRawgApiKey());

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url;
};

const requestRawg = async (path, params = {}) => {
  const response = await fetch(buildUrl(path, params));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new RawgApiError("RAWG API key is invalid or refused.", response.status);
    }

    if (response.status === 404) {
      throw new RawgApiError("Requested RAWG resource was not found.", response.status);
    }

    if (response.status === 429) {
      throw new RawgApiError("RAWG quota reached. Try again later.", response.status);
    }

    throw new RawgApiError(`RAWG request failed with HTTP ${response.status}.`, response.status);
  }

  return response.json();
};

const isObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asArray = (value) => (Array.isArray(value) ? value : []);
const asString = (value) => (typeof value === "string" ? value : "");
const asNumber = (value) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

const normalizeNamedItem = (item) => {
  if (!isObject(item)) return null;

  const id = item.id ?? item.slug ?? item.name;
  const name = asString(item.name);
  const slug = asString(item.slug);

  if (!id || !name) return null;

  return {
    id,
    name,
    slug,
  };
};

const normalizeNamedList = (value) =>
  asArray(value).map(normalizeNamedItem).filter(Boolean);

export const normalizePlatform = (entry) => {
  const platform = isObject(entry?.platform) ? entry.platform : entry;
  return normalizeNamedItem(platform);
};

export const normalizeGame = (game) => {
  if (!isObject(game)) return null;

  const id = game.id;
  const name = asString(game.name);
  const slug = asString(game.slug);

  if (!id || !name || !slug) return null;

  return {
    id,
    slug,
    name,
    released: asString(game.released),
    backgroundImage: asString(game.background_image),
    rating: asNumber(game.rating),
    ratingTop: asNumber(game.rating_top) || 5,
    ratingsCount: asNumber(game.ratings_count),
    platforms: asArray(game.platforms).map(normalizePlatform).filter(Boolean),
    genres: normalizeNamedList(game.genres),
    tags: normalizeNamedList(game.tags),
    developers: normalizeNamedList(game.developers),
    publishers: normalizeNamedList(game.publishers),
  };
};

export const normalizeGameDetail = (game) => {
  const baseGame = normalizeGame(game);
  if (!baseGame) return null;

  return {
    ...baseGame,
    nameOriginal: asString(game.name_original),
    description: asString(game.description_raw) || stripHtml(asString(game.description)),
    website: asString(game.website),
    backgroundImageAdditional: asString(game.background_image_additional),
    screenshotsCount: asNumber(game.screenshots_count),
    moviesCount: asNumber(game.movies_count),
  };
};

export const stripHtml = (value) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = value;
  return wrapper.textContent?.trim() ?? "";
};

const normalizePaginatedGames = (payload) => ({
  count: asNumber(payload?.count),
  next: asString(payload?.next),
  previous: asString(payload?.previous),
  results: asArray(payload?.results).map(normalizeGame).filter(Boolean),
});

const normalizeScreenshots = (payload) =>
  asArray(payload?.results)
    .filter(isObject)
    .map((screenshot) => ({
      id: screenshot.id ?? screenshot.image,
      image: asString(screenshot.image),
      width: asNumber(screenshot.width),
      height: asNumber(screenshot.height),
    }))
    .filter((screenshot) => screenshot.id && screenshot.image);

const normalizeMovies = (payload) => {
  const results = asArray(payload?.results);
  const source = results.length > 0 ? results : asArray(payload);

  return source
    .filter(isObject)
    .map((movie) => ({
      id: movie.id ?? movie.name ?? movie.preview,
      name: asString(movie.name),
      preview: asString(movie.preview),
      video: asString(movie.data?.max) || asString(movie.data?.["480"]) || asString(movie.data?.low),
    }))
    .filter((movie) => movie.id && movie.video);
};

const normalizeStores = (payload) =>
  asArray(payload?.results)
    .filter(isObject)
    .map((store) => ({
      id: store.id ?? store.url,
      url: asString(store.url),
      name:
        asString(store.store?.name) ||
        asString(store.store_name) ||
        storeUrlLabel(asString(store.url)),
    }))
    .filter((store) => store.id && store.url);

export const storeUrlLabel = (url) => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname || "Store";
  } catch {
    return "Store";
  }
};

const filterParamsFromRoute = (filters) => {
  const params = {
    page: 1,
    page_size: LIST_PAGE_SIZE,
    ordering: filters.ordering || "-added",
  };

  if (filters.search) {
    params.search = filters.search;
    params.search_precise = false;
  } else if (
    !filters.genre &&
    !filters.tag &&
    !filters.platform &&
    !filters.platformId &&
    !filters.developer &&
    !filters.publisher
  ) {
    params.dates = getUpcomingDateRange();
  }

  if (filters.genre) params.genres = filters.genre;
  if (filters.tag) params.tags = filters.tag;
  if (filters.developer) params.developers = filters.developer;
  if (filters.publisher) params.publishers = filters.publisher;

  if (filters.platformId) {
    params.platforms = filters.platformId;
  } else if (filters.platform) {
    const platform = PLATFORM_OPTIONS.find((option) => option.value === filters.platform);
    if (platform?.parentId) {
      params.parent_platforms = platform.parentId;
    } else {
      params.platforms = filters.platform;
    }
  }

  return params;
};

export const fetchGames = async (filters = {}) => {
  const payload = await requestRawg("/games", filterParamsFromRoute(filters));
  return normalizePaginatedGames(payload);
};

export const fetchGameDetail = async (slug) => {
  const payload = await requestRawg(`/games/${encodeURIComponent(slug)}`);
  const game = normalizeGameDetail(payload);

  if (!game) {
    throw new RawgApiError("RAWG returned an invalid game payload.");
  }

  return game;
};

export const fetchGameScreenshots = async (slug, pageSize = 4) => {
  const payload = await requestRawg(`/games/${encodeURIComponent(slug)}/screenshots`, {
    page: 1,
    page_size: pageSize,
  });
  return normalizeScreenshots(payload);
};

export const fetchGameMovies = async (slug) => {
  const payload = await requestRawg(`/games/${encodeURIComponent(slug)}/movies`);
  return normalizeMovies(payload);
};

export const fetchGameStores = async (slug) => {
  const payload = await requestRawg(`/games/${encodeURIComponent(slug)}/stores`, {
    page: 1,
    page_size: 4,
  });
  return normalizeStores(payload);
};

export const fetchSimilarGames = async (game) => {
  const genre = game.genres[0]?.slug;
  if (!genre) return [];

  const payload = await requestRawg("/games", {
    page: 1,
    page_size: 7,
    genres: genre,
    ordering: "-rating",
  });

  return normalizePaginatedGames(payload).results
    .filter((similar) => similar.slug !== game.slug)
    .slice(0, 6);
};

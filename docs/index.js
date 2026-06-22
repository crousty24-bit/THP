const API_KEY_PATTERN = /apiKey\s*:\s*["']([^"']*)["']/;
const PLACEHOLDER_KEYS = new Set(["", "YOUR_RAWG_API_KEY", "YOUR_UNSPLASH_ACCESS_KEY"]);

const getApiKeyFromConfig = (configText) => {
  const match = configText.match(API_KEY_PATTERN);
  return match?.[1]?.trim() ?? "";
};

const hasUsableApiKey = (configText) => {
  const apiKey = getApiKeyFromConfig(configText);
  return Boolean(apiKey) && !PLACEHOLDER_KEYS.has(apiKey);
};

const showBadge = (card, selector) => {
  const badge = card.querySelector(selector);
  if (badge) badge.hidden = false;
};

const markLatestProject = () => {
  const cards = document.querySelectorAll(".project-card");
  const latestCard = cards[cards.length - 1];

  if (!latestCard) return;

  latestCard.classList.add("project-card--latest");
  showBadge(latestCard, ".status-badge--latest");
};

const markApiStates = async () => {
  const apiCards = document.querySelectorAll("[data-api-config]");

  await Promise.all(
    [...apiCards].map(async (card) => {
      try {
        const response = await fetch(card.dataset.apiConfig, { cache: "no-store" });
        if (!response.ok) {
          showBadge(card, ".status-badge--degraded");
          return;
        }

        const configText = await response.text();
        if (!hasUsableApiKey(configText)) {
          showBadge(card, ".status-badge--degraded");
        }
      } catch {
        showBadge(card, ".status-badge--degraded");
      }
    })
  );
};

markLatestProject();
markApiStates();

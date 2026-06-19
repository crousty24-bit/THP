export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const formatDate = (value) => {
  if (!value) return "Release date unavailable";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatRating = (rating, ratingTop = 5) => {
  if (!rating) return "No rating";
  return `${rating.toFixed(2)}/${ratingTop || 5}`;
};

export const commaList = (items) =>
  items.map((item) => item.name).filter(Boolean).join(", ");

export const routeUrl = (path = "/") => `#${path}`;

export const firstSentence = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const match = text.match(/^(.{24,180}?[.!?])\s/);
  return match?.[1] ?? text.slice(0, 170);
};

export const linkToFilter = (type, item) => {
  const params = new URLSearchParams();
  params.set(type, item.slug || item.id || item.name);
  return routeUrl(`/?${params.toString()}`);
};

export const linkToPlatform = (platform) => {
  const params = new URLSearchParams();
  params.set("platformId", platform.id);
  params.set("platformName", platform.name);
  params.set("ordering", "-released");
  return routeUrl(`/?${params.toString()}`);
};

export const renderTextBlocks = (value) => {
  const blocks = String(value ?? "")
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const headingMatch = block.match(/^#{2,4}\s*(.+)$/);
      if (headingMatch) {
        return `<h2>${escapeHtml(headingMatch[1].trim())}</h2>`;
      }

      const cleaned = block.replace(/^#{2,4}\s*/gm, "").trim();
      return `<p>${escapeHtml(cleaned)}</p>`;
    })
    .join("");
};

export const renderStatus = (title, message, isError = false) => `
  <section class="status-panel ${isError ? "status-panel--error" : ""}" role="status">
    <h2>${escapeHtml(title)}</h2>
    <p>${escapeHtml(message)}</p>
  </section>
`;

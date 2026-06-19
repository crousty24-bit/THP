export const createRouter = (root, routes) => {
  const render = () => {
    const path = window.location.pathname;
    const screenshotsMatch = path.match(/^\/game\/([^/]+)\/screenshots\/?$/);
    const detailMatch = path.match(/^\/game\/([^/]+)\/?$/);

    if (screenshotsMatch) {
      routes.screenshots({
        root,
        slug: decodeURIComponent(screenshotsMatch[1]),
      });
      return;
    }

    if (detailMatch) {
      routes.detail({
        root,
        slug: decodeURIComponent(detailMatch[1]),
      });
      return;
    }

    routes.list({
      root,
      filters: Object.fromEntries(new URLSearchParams(window.location.search)),
    });
  };

  const navigate = (url) => {
    window.history.pushState({}, "", url);
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-route]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("http")) return;

    event.preventDefault();
    navigate(href);
  });

  window.addEventListener("popstate", render);

  return {
    render,
    navigate,
  };
};

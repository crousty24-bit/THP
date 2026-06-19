export const createRouter = (root, routes) => {
  const getCurrentRoute = () => {
    const hashRoute = window.location.hash.replace(/^#/, "");
    return hashRoute || "/";
  };

  const render = () => {
    const route = getCurrentRoute();
    const [path, queryString = ""] = route.split("?");
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
      filters: Object.fromEntries(new URLSearchParams(queryString)),
    });
  };

  const navigate = (url) => {
    const route = url.startsWith("#") ? url.slice(1) : url;
    const hash = `#${route || "/"}`;

    if (window.location.hash !== hash) {
      window.history.pushState({}, "", hash);
    }

    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-route]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("http")) return;

    event.preventDefault();
    navigate(href.startsWith("#") ? href.slice(1) : href);
  });

  window.addEventListener("popstate", render);

  return {
    render,
    navigate,
  };
};

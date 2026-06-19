import "./styles/main.scss";
import { createRouter } from "./router";
import { renderPageDetail } from "./views/page-detail";
import { renderPageList } from "./views/page-list";
import { renderScreenshotsPage } from "./views/page-screenshots";

const root = document.querySelector("#app");

const loadOptionalRawgConfig = async () => {
  try {
    const response = await fetch("rawg-config.js", { method: "HEAD" });
    if (!response.ok) return;

    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "rawg-config.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch {
    // The local config is optional. The UI renders a clear missing-key state.
  }
};

const start = async () => {
  await loadOptionalRawgConfig();

  window.appRouter = createRouter(root, {
    list: renderPageList,
    detail: renderPageDetail,
    screenshots: renderScreenshotsPage,
  });

  window.appRouter.render();
};

start();

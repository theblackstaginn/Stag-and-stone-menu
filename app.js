// app.js
(() => {
  "use strict";

  // Optional: register a service worker later if you add sw.js for offline caching
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
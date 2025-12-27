// Simple offline cache for the portrait menu.
// First load requires connectivity; afterward it works offline.

const CACHE = "stag-stone-menu-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./menu.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try{
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      // cache same-origin GETs
      if (req.method === "GET" && new URL(req.url).origin === self.location.origin){
        cache.put(req, fresh.clone());
      }
      return fresh;
    }catch{
      // fallback to menu if offline and navigation fails
      if (req.mode === "navigate") return caches.match("./menu.html");
      throw new Error("offline");
    }
  })());
});

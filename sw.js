const CACHE_VERSION = "2025.12.27.4";
const CACHE_NAME = `stag-stone-menu-${CACHE_VERSION}`;

// Core files required for offline display
const CORE_ASSETS = [
"./",
"./index.html",
"./styles.css",
"./menu.js",
"./app.js",
"./manifest.webmanifest"
// Add icons later if desired:
// "./icons/icon-192.png",
// "./icons/icon-512.png"
];

// INSTALL — cache core assets
self.addEventListener("install", (event) => {
self.skipWaiting();
event.waitUntil(
(async () => {
const cache = await caches.open(CACHE_NAME);
await cache.addAll(
CORE_ASSETS.map(
(url) => new Request(url, { cache: "reload" })
)
);
})()
);
});

// ACTIVATE — delete old caches
self.addEventListener("activate", (event) => {
event.waitUntil(
(async () => {
const keys = await caches.keys();
await Promise.all(
keys.map((key) => {
if (key.startsWith("stag-stone-menu-") && key !== CACHE_NAME) {
return caches.delete(key);
}
})
);
await self.clients.claim();
})()
);
});

// ALLOW IMMEDIATE ACTIVATION
self.addEventListener("message", (event) => {
if (event?.data?.type === "SKIP_WAITING") {
self.skipWaiting();
}
});

// FETCH STRATEGY
self.addEventListener("fetch", (event) => {
const req = event.request;

if (req.method !== "GET") return;

const url = new URL(req.url);

// Only handle same-origin requests
if (url.origin !== self.location.origin) return;

const accept = req.headers.get("accept") || "";

// HTML — network first (so updates appear quickly)
if (accept.includes("text/html")) {
event.respondWith(networkFirst(req));
return;
}

// Everything else — stale-while-revalidate
event.respondWith(staleWhileRevalidate(req));
});

// ---------- Strategies ----------

async function networkFirst(req) {
const cache = await caches.open(CACHE_NAME);

try {
const fresh = await fetch(req);
if (fresh && fresh.ok) {
cache.put(req, fresh.clone());
}
return fresh;
} catch (_) {
const cached = await cache.match(req);
if (cached) return cached;

const fallback = await cache.match("./index.html");
return fallback || new Response("Offline", { status: 503 });
}
}

async function staleWhileRevalidate(req) {
const cache = await caches.open(CACHE_NAME);

const cached = await cache.match(req);

const fetchPromise = fetch(req)
.then((fresh) => {
if (fresh && fresh.ok) {
cache.put(req, fresh.clone());
}
return fresh;
})
.catch(() => null);

if (cached) return cached;

const fresh = await fetchPromise;
if (fresh) return fresh;

const fallback = await cache.match("./index.html");
return fallback || new Response("Offline", { status: 503 });
}

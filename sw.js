/* sw.js — Stag & Stone Menu Offline Cache
Strategy:
- HTML: network-first (keeps updates snappy)
- CSS/JS/fonts/images: stale-while-revalidate (fast + updates in background)
- Versioned cache name to avoid stale asset traps
*/

const CACHE_VERSION = "2025.12.27.1";
const CACHE_NAME = `stag-stone-menu-${CACHE_VERSION}`;

// Core assets to pre-cache for offline use.
// IMPORTANT: keep these relative; GitHub Pages project sites live in a subpath.
const CORE_ASSETS = [
"./",
"./index.html",
"./styles.css",
"./menu.js",
"./app.js",
"./manifest.webmanifest"
// Add icons when you have them:
// "./icons/icon-192.png",
// "./icons/icon-512.png"
];

// ------------------------------
// Install: pre-cache core assets
// ------------------------------
self.addEventListener("install", (event) => {
self.skipWaiting();
event.waitUntil(
(async () => {
const cache = await caches.open(CACHE_NAME);
// Use {cache: "reload"} to bypass any intermediate caches on install
await cache.addAll(CORE_ASSETS.map(u => new Request(u, { cache: "reload" })));
})()
);
});

// ------------------------------
// Activate: purge old caches
// ------------------------------
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

// ------------------------------
// Message: allow app.js to trigger immediate activation
// ------------------------------
self.addEventListener("message", (event) => {
const msg = event?.data;
if (!msg || typeof msg !== "object") return;

if (msg.type === "SKIP_WAITING") {
self.skipWaiting();
}
});

// ------------------------------
// Fetch handlers
// ------------------------------
self.addEventListener("fetch", (event) => {
const req = event.request;

// Only handle GET
if (req.method !== "GET") return;

const url = new URL(req.url);

// Ignore non-http(s)
if (url.protocol !== "http:" && url.protocol !== "https:") return;

// Only same-origin caching (keeps behavior predictable)
if (url.origin !== self.location.origin) return;

const dest = req.destination; // "document", "style", "script", "image", "font", etc.

// 1) HTML/documents: Network-first
if (dest === "document" || req.headers.get("accept")?.includes("text/html")) {
event.respondWith(networkFirst(req));
return;
}

// 2) Everything else: stale-while-revalidate
event.respondWith(staleWhileRevalidate(req));
});

// ------------------------------
// Strategies
// ------------------------------
async function networkFirst(req) {
const cache = await caches.open(CACHE_NAME);
try {
const fresh = await fetch(req);
// Cache successful responses
if (fresh && fresh.ok) {
cache.put(req, fresh.clone());
}
return fresh;
} catch (err) {
// Offline: return cached, or fallback to cached index
const cached = await cache.match(req);
if (cached) return cached;

// If someone hits a page offline, try returning index as a last resort
const fallback = await cache.match("./index.html");
return fallback || new Response("Offline", { status: 503, statusText: "Offline" });
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

// If cached exists, return immediately; update happens in background.
if (cached) return cached;

// Otherwise wait for network; if that fails, attempt a core fallback
const fresh = await fetchPromise;
if (fresh) return fresh;

// Minimal fallback for offline:
// try returning index if request is for a known core asset
const fallback = await cache.match("./index.html");
return fallback || new Response("Offline", { status: 503, statusText: "Offline" });
}

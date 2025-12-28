/* app.js — Stag & Stone Menu Shell
Goals:
- Safe service worker registration (no cache hell)
- Versioned cache strategy hook
- Optional: Wake Lock + Fullscreen helpers for TV/tablet
*/

(() => {
"use strict";

// =========================
// VERSION CONTROL (bump when deploying)
// =========================
// When you change this number, the app will:
// - tell the service worker to update
// - hard reload once to pick up new assets
const APP_VERSION = "2025.12.27.1";

// Store keys
const LS_VERSION_KEY = "stag_menu_version";

// =========================
// SERVICE WORKER
// =========================
async function registerServiceWorker() {
if (!("serviceWorker" in navigator)) return;

try {
// IMPORTANT: relative path for GitHub Pages project sites
const reg = await navigator.serviceWorker.register("./sw.js", { scope: "./" });

// Ask SW to update immediately on load
if (reg.update) reg.update();

// If a new SW is waiting, activate it now
if (reg.waiting) {
reg.waiting.postMessage({ type: "SKIP_WAITING" });
}

// If a new SW installs in the background, activate it
reg.addEventListener("updatefound", () => {
const sw = reg.installing;
if (!sw) return;

sw.addEventListener("statechange", () => {
if (sw.state === "installed" && navigator.serviceWorker.controller) {
// A new version is ready; ask it to take over
sw.postMessage({ type: "SKIP_WAITING" });
}
});
});

// When the controller changes, reload once to get the new cached assets
let reloaded = false;
navigator.serviceWorker.addEventListener("controllerchange", () => {
if (reloaded) return;
reloaded = true;
window.location.reload();
});

} catch (err) {
// If SW fails, we still want the menu to load normally.
console.warn("Service worker registration failed:", err);
}
}

// =========================
// VERSION BUMP = ONE-TIME HARD REFRESH
// =========================
function enforceVersionRefresh() {
try {
const prev = localStorage.getItem(LS_VERSION_KEY);
if (prev !== APP_VERSION) {
localStorage.setItem(LS_VERSION_KEY, APP_VERSION);

// Force-reload bypassing cache (best effort; browsers vary)
// This prevents “why didn't my CSS update?” moments.
const url = new URL(window.location.href);
url.searchParams.set("v", APP_VERSION);
window.location.replace(url.toString());
}
} catch (_) {
// ignore
}
}

// =========================
// WAKE LOCK (optional, helps TV/tablet stay awake)
// =========================
let wakeLock = null;

async function requestWakeLock() {
try {
if (!("wakeLock" in navigator)) return;
wakeLock = await navigator.wakeLock.request("screen");

// If the tab loses visibility, wake lock can release; reacquire when visible again.
document.addEventListener("visibilitychange", async () => {
if (document.visibilityState === "visible") {
try {
wakeLock = await navigator.wakeLock.request("screen");
} catch (_) {}
}
});
} catch (_) {
// Not fatal
}
}

// =========================
// FULLSCREEN (optional, user gesture required)
// =========================
async function enterFullscreen() {
const el = document.documentElement;
if (!el.requestFullscreen) return;
try {
await el.requestFullscreen();
} catch (_) {}
}

function bindFullscreenHotkey() {
// Press "F" to toggle fullscreen (desktop convenience)
window.addEventListener("keydown", (e) => {
if (e.key.toLowerCase() !== "f") return;
if (document.fullscreenElement) {
document.exitFullscreen?.();
} else {
enterFullscreen();
}
}, { passive: true });
}

// =========================
// INIT
// =========================
function init() {
// 1) Prevent stale asset confusion
enforceVersionRefresh();

// 2) Register SW after initial paint (avoid blocking)
window.addEventListener("load", () => {
registerServiceWorker();
requestWakeLock();
bindFullscreenHotkey();
}, { once: true });
}

init();
})();

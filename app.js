(() => {
"use strict";

// IMPORTANT: bump this when you want a guaranteed refresh
const APP_VERSION = "2025.12.27.3";
const LS_KEY = "stag_stone_menu_version";

function forceOneTimeRefreshOnVersionChange() {
try {
const prev = localStorage.getItem(LS_KEY);
if (prev !== APP_VERSION) {
localStorage.setItem(LS_KEY, APP_VERSION);

const url = new URL(window.location.href);
url.searchParams.set("v", APP_VERSION);
window.location.replace(url.toString());
}
} catch (_) {
// If storage is blocked, we just skip.
}
}

async function registerSW() {
if (!("serviceWorker" in navigator)) return;

try {
const reg = await navigator.serviceWorker.register("./sw.js", { scope: "./" });

// Ask it to update ASAP
reg.update?.();

// If there's a waiting worker, activate it immediately
if (reg.waiting) {
reg.waiting.postMessage({ type: "SKIP_WAITING" });
}

// When a new worker installs, skip waiting
reg.addEventListener("updatefound", () => {
const sw = reg.installing;
if (!sw) return;

sw.addEventListener("statechange", () => {
if (sw.state === "installed" && navigator.serviceWorker.controller) {
sw.postMessage({ type: "SKIP_WAITING" });
}
});
});

// Reload once when the new SW takes control
let reloaded = false;
navigator.serviceWorker.addEventListener("controllerchange", () => {
if (reloaded) return;
reloaded = true;
window.location.reload();
});
} catch (err) {
console.warn("Service worker registration failed:", err);
}
}

// Keep the menu awake (Chromium signage devices often support this)
let wakeLock = null;
async function requestWakeLock() {
try {
if (!("wakeLock" in navigator)) return;
wakeLock = await navigator.wakeLock.request("screen");

document.addEventListener("visibilitychange", async () => {
if (document.visibilityState === "visible") {
try {
wakeLock = await navigator.wakeLock.request("screen");
} catch (_) {}
}
});
} catch (_) {}
}

function fullscreenHotkey() {
window.addEventListener("keydown", (e) => {
if (e.key.toLowerCase() !== "f") return;

if (document.fullscreenElement) {
document.exitFullscreen?.();
} else {
document.documentElement.requestFullscreen?.();
}
}, { passive: true });
}

function init() {
forceOneTimeRefreshOnVersionChange();

window.addEventListener("load", () => {
registerSW();
requestWakeLock();
fullscreenHotkey();
}, { once: true });
}

init();
})();

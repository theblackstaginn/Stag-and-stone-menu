// Simple offline cache for the portrait menu.
// First load requires connectivity; afterward it works // SERVICE WORKER TEMPORARILY DISABLED
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

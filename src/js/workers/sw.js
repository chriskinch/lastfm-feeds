console.log("Service Worker starting up!");


self.addEventListener('install', event => {
  console.log("Service Worker installing!");
  console.log("Install Event", event);
  self.skipWaiting();
});

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', event => {
  console.log("Service Worker activating!");
  console.log("Activate Event", event);
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  console.log("Fetch Event", event.request.url);
});


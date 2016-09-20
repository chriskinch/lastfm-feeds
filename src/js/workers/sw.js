console.log("Service worker started!");

const cacheName  = 'lastfm-me-offline';
const scope      = '';
const cacheFiles = [
  '',
  'static/css/main.2d125fe6.css',
  'static/js/main.d3a2ff6b.js',
  'static/media/logo.5d5d9eef.svg',
  'favicon.ico'
].map(path => `${scope}/${path}`);

function fetchFromCache (request) {
  console.log("Fetching from cache: ", request);
  return caches.match(request).then(response => {
    console.log("Cache says: ", response);
    if (!response) {
      throw Error(`${request.url} not found in cache`);
    }
    return response;
  });
}

function addToCache (request, response) {
  if (response.ok) {
    console.log("Adding to cache: ", request.url, request, response);
    const copy = response.clone();
    caches.open(`${cacheName}`).then(cache => {
      cache.put(request, copy);
    });
  }
  return response;
}

self.addEventListener('install', event => {
  console.log("Service worker installing!");
  event.waitUntil(
    caches.open(`${cacheName}`).then(cache => {
      return cache.addAll(cacheFiles);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  console.log("Service worker fetching:", event.request.url);

  event.respondWith(
    fetch(event.request)
    .then(response => addToCache(event.request, response))
    .catch(() => fetchFromCache(event.request))
  );
});

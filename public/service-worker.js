// service-worker.js

const CACHE_NAME = "smrehman-portfolio-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.webmanifest",
  "/images/bus1.png",
  "/images/peoplebus.png",
  "/images/tuk.png",
  "/images/route.png",
  "/images/pbus.png",
  "/images/ebus.png",
  "/styles/globals.css",

];

// ✅ Install event: caching assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ✅ Activate event: cleaning old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ✅ Fetch event: network-first with cache fallback
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

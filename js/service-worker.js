const CACHE_NAME = "glow-flow-v1";
const OFFLINE_URL = "./html/offline.html";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./html/game.html",
  "./html/settings.html",
  "./html/statistics.html",
  "./html/offline.html",
  "./css/main.css",
  "./css/game.css",
  "./css/settings.css",
  "./css/statistics.css",
  "./js/main.js",
  "./js/game.js",
  "./js/settings.js",
  "./js/statistics.js",
  "./icons/favicon.png",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
  "./audio/bg-music.mp3",
  "./audio/collision.mp3",
  "./audio/explosion.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
          console.error("Failed to cache some resources:", error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).catch((error) => {
            console.error("Fetch failed; returning offline page:", error);
            return caches.match(OFFLINE_URL);
          })
        );
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});

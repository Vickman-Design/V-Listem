const CACHE_NAME = "vilister-cache-v1";

const urlsToCache = [
  "/",
  "/offline",
  "/manifest.json",
  "/icon-192.png",
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// FETCH (offline fallback)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match("/offline");
      });
    })
  );
});



 // PUSH EVENT LISTENER
self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  const title = data.title || "Vi~Lister";
  const options = {
    body: data.message || "New notification",
    icon: "/icon-192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
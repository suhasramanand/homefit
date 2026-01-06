/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

const CACHE_NAME = "HomeFit-cache-v1";
const urlsToCache = [
  // Add Files thah you want to cache
  "./index.html",
];

// htmlfile, png File, css file

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  // clean up cache activity or useless cache.

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // caches.delete will return me a promise
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Offline experience
  // Whenever a file is requested
  // 1. fetch from network, if there is new data i will update my cache. if network call fails i will use cache as a fallback.

  // Skip non-HTTP requests
  if (!event.request.url.startsWith("http")) return;

  const url = new URL(event.request.url);
  const requestMethod = event.request.method;

  // Skip caching for POST, PUT, DELETE, PATCH, OPTIONS requests (Cache API doesn't support these)
  // Also skip all API calls and external services
  if (
    requestMethod !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("maps.gstatic.com") ||
    url.hostname.includes("maps.googleapis.com") ||
    !url.hostname.includes("localhost")
  ) {
    // Just pass through without any caching attempt
    event.respondWith(fetch(event.request));
    return;
  }

  // Only cache static assets (GET requests to localhost only)
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // Only cache successful GET responses for static assets
        if (res.status === 200 && res.type === 'basic') {
          const cloneData = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            try {
              cache.put(event.request, cloneData);
            } catch (error) {
              // Silently fail if caching fails
              console.warn("Failed to cache request:", error);
            }
          });
        }
        console.log("returning from network");
        return res;
      })
      .catch(() => {
        console.log("Returning from cache");
        return caches.match(event.request).then((file) => file || fetch(event.request));
      })
  );
});

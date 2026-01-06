export function registerServiceWorker() {
  // Service worker registration disabled for development
  // Only enable in production if you need PWA features
  // The service-worker.js file exists but causes 404 errors on nested routes
  if (false && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js") // Use absolute path from root
        .then((reg) => {
          // Success - service worker registered
        })
        .catch((err) => {
          // Silently fail - service worker is optional
        });
    });
  }
}

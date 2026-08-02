export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] ServiceWorker registered with scope:', registration.scope);
          // Check for service worker updates immediately
          registration.update();
        })
        .catch((error) => {
          console.warn('[SW] ServiceWorker registration failed:', error);
        });
    });
  }
}

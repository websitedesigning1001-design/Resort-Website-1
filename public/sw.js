// Aura Cove Sanctuary — Service Worker
// Cache-first for static assets, network-first for API, offline fallback

const CACHE_NAME = 'aura-cove-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
  '/manifest.json',
];

// ── Install: pre-cache critical shell assets ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: purge stale caches from older versions ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch strategies ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Network-first for API requests
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/uploads')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets (CSS, JS, fonts, images, SVGs)
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-first for navigation / HTML requests
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: cache-first
  event.respondWith(cacheFirst(request));
});

// ── Helpers ──

function isStaticAsset(url) {
  return /\.(css|js|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|svg|ico)$/i.test(
    url.pathname
  );
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return offlineFallback();
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return offlineFallback();
  }
}

function offlineFallback() {
  return new Response(
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Offline — Aura Cove Sanctuary</title><style>*{margin:0;padding:0;box-sizing:border-box}body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#e0d6c8;font-family:system-ui,sans-serif;text-align:center;padding:2rem}.wrap h1{font-size:2rem;margin-bottom:1rem;letter-spacing:.04em}.wrap p{opacity:.7;line-height:1.6}</style></head><body><div class="wrap"><h1>You\'re Offline</h1><p>It seems you\'ve lost your connection.<br>Please check your network and try again.</p></div></body></html>',
    {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}

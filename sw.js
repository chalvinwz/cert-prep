// Service worker for offline use.
// Pages are fetched network-first (so a new deploy shows up on the next online visit)
// and fall back to the cached copy when offline or when the network takes over 4s.
// Icons, manifest and Google Fonts are served from cache and refreshed in the background.
// Bump VERSION only when the PRECACHE list itself changes.
const VERSION = 'v1';
const SHELL = 'cert-shell-' + VERSION;
const RUNTIME = 'cert-runtime-' + VERSION;
const PRECACHE = [
  './',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/favicon-32.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
];
const NETWORK_TIMEOUT_MS = 4000;
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
      event.respondWith(networkFirst(event, req));
    } else {
      event.respondWith(staleWhileRevalidate(event, req, SHELL));
    }
  } else if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(event, req, RUNTIME));
  }
});

function cacheable(res) {
  return res && (res.ok || res.type === 'opaque');
}

async function networkFirst(event, req) {
  const cache = await caches.open(SHELL);
  const network = fetch(req).then(res => {
    if (res.ok) cache.put(req.mode === 'navigate' ? './' : req, res.clone());
    return res;
  });
  event.waitUntil(network.catch(() => {}));
  try {
    return await Promise.race([
      network,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT_MS)),
    ]);
  } catch (e) {
    const cached = (await cache.match(req, { ignoreSearch: true })) || (await cache.match('./'));
    return cached || network;
  }
}

async function staleWhileRevalidate(event, req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req).then(res => {
    if (cacheable(res)) cache.put(req, res.clone());
    return res;
  });
  event.waitUntil(network.catch(() => {}));
  return cached || network;
}

// Fahrtenbuch Service Worker · Version 2.6.1
const CACHE = "fahrtenbuch-v2.6.1";
const ASSETS = [
  './', 'index.html', 'manifest.json',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png',
  'apple-touch-icon.png', 'apple-touch-icon-120.png', 'apple-touch-icon-152.png',
  'apple-touch-icon-167.png', 'apple-touch-icon-180.png',
  'favicon.ico', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'api.github.com') return;
  if (req.mode === 'navigate' || (req.headers.get('accept')||'').includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }))
  );
});

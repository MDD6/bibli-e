// Service Worker para cache básico da SPA
const CACHE_NAME = 'bibli-e-v1';
const CORE_ASSETS = [
  'index.html',
  'styles/main.css',
  'manifest.json',
  'scripts/auth.js',
  'scripts/loanStore.js',
  'scripts/router.js',
  'scripts/script.js',
  'scripts/search.js'
];

// Views serão cacheadas sob demanda
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy: network first for views and HTML, fallback to cache.
  if(request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')){
    event.respondWith(
      fetch(request).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return res;
      }).catch(() => caches.match(request).then(r => r || caches.match('index.html')))
    );
    return;
  }

  // For static assets: cache first, update in background.
  if(CORE_ASSETS.some(a => url.pathname.endsWith(a))){
    event.respondWith(
      caches.match(request).then(cached => {
        const networkUpdate = fetch(request).then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(request, res.clone()));
          return res;
        }).catch(() => cached);
        return cached || networkUpdate;
      })
    );
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).catch(() => cached))
  );
});

// Receber mensagens para notificações
self.addEventListener('message', event => {
  const data = event.data;
  if(data && data.type==='notify'){
    if(self.registration && Notification && Notification.permission==='granted'){
      self.registration.showNotification('Biblioteca', {
        body: data.message,
        icon: 'icons/icon-192.png'
      });
    }
  }
});

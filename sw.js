const CACHE = 'dce-f-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Images attributs
  './images/DAHARI.png',
  './images/platier.png',
  './images/crete.png',
  './images/au_dela.png',
  './images/tampon_absence.png',
  './images/tampon_presence.png',
  './images/0hh.png',
  './images/2hh.png',
  './images/4hh.png',
  './images/6hh.png',
  './images/comp_aucune.png',
  './images/frigo.png',
  './images/fournitures.png',
  './images/hangar.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});

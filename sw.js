/* Joga Intelligence — Service Worker
   Estrategia:
   - Navegaciones (páginas): network-first → si no hay red, sirve desde caché (offline).
   - Estáticos mismo origen y fuentes: stale-while-revalidate (rápido + se actualiza solo).
   Sube CACHE_VERSION cada vez que quieras forzar refresco tras un deploy. */

const CACHE_VERSION = 'joga-v30';
const CACHE = `joga-cache-${CACHE_VERSION}`;

/* Shell mínimo que se precachea al instalar.
   Se mantiene corto a propósito: si un archivo faltara, addAll NO falla en bloque
   porque lo envolvemos en intentos individuales. El resto (las 6 apps) se cachea
   solo al visitarlas la primera vez con red. */
const CORE = [
  './',
  './index.html',
  './retos.html',
  './gate.js',
  './joga-emblem.svg',
  './joga-lockup.svg',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cachea uno por uno para que un 404 no rompa toda la instalación
    await Promise.all(CORE.map(async (url) => {
      try { await cache.add(new Request(url, { cache: 'reload' })); }
      catch (e) { /* ignora el que falle */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => k.startsWith('joga-cache-') && k !== CACHE ? caches.delete(k) : null));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Páginas (navegación): network-first con fallback a caché
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        return cached || await caches.match('./index.html');
      }
    })());
    return;
  }

  // Estáticos mismo origen + Google Fonts: stale-while-revalidate
  const isFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');
  if (sameOrigin || isFont) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      return cached || (await network) || new Response('', { status: 504 });
    })());
  }
});


/* ===== Recordatorio diario / Daily reminder =====
   La pagina guarda la config en IndexedDB (on, hour, lang, lastShown).
   El SW la lee al recibir un ping de la pagina o un periodicsync (PWA instalada). */
function rdbOpen() {
  return new Promise((res) => {
    try {
      const rq = indexedDB.open('joga-reminder', 1);
      rq.onupgradeneeded = () => { rq.result.createObjectStore('kv'); };
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => res(null);
    } catch (e) { res(null); }
  });
}
function rdbGet(key) {
  return rdbOpen().then((db) => new Promise((res) => {
    if (!db) return res(null);
    try {
      const g = db.transaction('kv', 'readonly').objectStore('kv').get(key);
      g.onsuccess = () => res(g.result || null);
      g.onerror = () => res(null);
    } catch (e) { res(null); }
  }));
}
function rdbSet(key, val) {
  return rdbOpen().then((db) => new Promise((res) => {
    if (!db) return res(false);
    try {
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put(val, key);
      tx.oncomplete = () => res(true);
      tx.onerror = () => res(false);
    } catch (e) { res(false); }
  }));
}
function localDay(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
async function maybeRemind() {
  const cfg = await rdbGet('cfg');
  if (!cfg || !cfg.on) return;
  const now = new Date(), today = localDay(now);
  const last = await rdbGet('lastShown');
  if (last === today) return;
  if (now.getHours() < (typeof cfg.hour === 'number' ? cfg.hour : 8)) return;
  const es = cfg.lang !== 'en';
  await self.registration.showNotification('Joga Intelligence', {
    body: es ? '\u{1F525} No rompas la cadena: tu pr\u00e1ctica de hoy te espera.'
             : '\u{1F525} Don\u2019t break the chain: today\u2019s practice is waiting for you.',
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'joga-daily',
    renotify: false
  });
  await rdbSet('lastShown', today);
}
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'joga-daily') event.waitUntil(maybeRemind());
});
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'joga-remind-check') {
    const p = maybeRemind();
    if (event.waitUntil) event.waitUntil(p);
  }
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('./app.html'));
});

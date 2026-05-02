/* TheLittleNaga — Service Worker v10 (cache-busted) */
const CACHE = 'tln-v10';

/* Third-party libs cached aggressively (they're versioned URLs) */
const STATIC_LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
];

/* Own assets we want fast cold-start on (icons mostly) */
const OWN_PRECACHE = [
  'icons/icon-192.png',
  'icons/icon-512.png',
  'favicon.ico'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all([
        c.addAll(STATIC_LIBS).catch(()=>{}),
        c.addAll(OWN_PRECACHE).catch(()=>{})
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  /* NEVER cache these — always fresh from network.
     - HTML, manifest, service worker itself: avoids stale UI bugs.
     - Supabase: dynamic user data.
     - Google Fonts: font files (network-first keeps rendering crisp). */
  const neverCache =
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('manifest.json') ||
    url.pathname.endsWith('sw.js') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (neverCache) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  /* Cache-first for versioned CDN libs and own static assets (icons/favicon).
     If the network fails after cache miss, we let the request fail naturally. */
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.ok && res.type !== 'opaqueredirect') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
        }
        return res;
      });
    })
  );
});

/* Listen for skipWaiting message — used if we ever want to force-update from the app */
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

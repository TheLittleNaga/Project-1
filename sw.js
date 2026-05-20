/* TheLittleNaga — Service Worker v11 (Web Push + cache-busting) */
const CACHE = 'tln-v11';

/* Third-party libs cached aggressively (they're versioned URLs) */
const STATIC_LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
];

/* Own assets we want fast cold-start on */
const OWN_PRECACHE = [
  'icons/icon-192.png',
  'icons/icon-512.png',
  'favicon.ico'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all([
        c.addAll(STATIC_LIBS).catch(() => {}),
        c.addAll(OWN_PRECACHE).catch(() => {})
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

  /* NEVER cache HTML, manifest, sw, Supabase, or fonts */
  const neverCache =
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('manifest.json') ||
    url.pathname.endsWith('sw.js') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (neverCache) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  /* Cache-first for versioned CDN libs and icons */
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.ok && res.type !== 'opaqueredirect') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone())).catch(() => {});
        }
        return res;
      });
    })
  );
});

/* ─── Web Push ────────────────────────────────────────────────────────────
   The Supabase Edge Function sends a JSON payload like:
   {
     "title": "Budget alert",
     "body":  "Grocery at 80% · ₹4,800 / ₹6,000",
     "tag":   "bud-grocery-p80-2025-06",
     "url":   "/"
   }
   The service worker shows it as a native Android / Chrome OS notification.
──────────────────────────────────────────────────────────────────────── */
self.addEventListener('push', e => {
  if (!e.data) return;

  let data = {};
  try { data = e.data.json(); } catch (_) { data = { title: 'TheLittleNaga', body: e.data.text() }; }

  const title = data.title || 'TheLittleNaga';
  const options = {
    body:    data.body  || '',
    tag:     data.tag   || 'tln-' + Date.now(),
    icon:    'icons/icon-192.png',
    badge:   'icons/icon-192.png',
    // Keep the notification visible until the user taps it
    requireInteraction: false,
    // Vibrate pattern: short-pause-short (feels crisp on Android)
    vibrate: [80, 100, 80],
    data: { url: data.url || '/' }
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

/* Tapping the notification opens / focuses the app */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || '/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // If there's already an open tab/window, focus it
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});

/* Force-update from the app if needed */
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

const CACHE_NAME = 'rm-movies-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/auth.html',
  '/dashboard.html',
  '/watch.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/scripts/auth.js',
  '/scripts/api.js',
  '/scripts/dashboard.js',
  '/scripts/watch.js',
  'https://vjs.zencdn.net/7.20.3/video.min.js',
  'https://vjs.zencdn.net/7.20.3/video-js.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
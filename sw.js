var CACHE_PREFIX = 'saf-tc-';
var CACHE_VERSION = 'v0.3';
var CACHE_NAME = CACHE_PREFIX+CACHE_VERSION;

var SHELL_CACHE = [
  './app.html',
  './manifest.json',
  './favicon.ico',
  './resources/js/app.js',
  './resources/js/app-svc.js',
  './resources/js/app-db.js',
  './resources/js/app-utils.js',
  './resources/css/app.css',
  './resources/components/checking.js',
  './resources/components/combat.js',
  './resources/components/combats.js',
  './resources/components/create-tournament.js',
  './resources/components/future.js',
  './resources/components/tournaments.js',
  './resources/img/base/car-saf.png',
  './resources/img/base/swords.png',
  './resources/img/base/thinking.png',
  './resources/img/icons/chess.svg',
  './resources/img/icons/chevron-left.svg',
  './resources/img/icons/chevron-right.svg',
  './resources/img/icons/fist-raised.svg',
  './resources/img/icons/flag.svg',
  './resources/img/icons/saf-ico-96.png',
  './resources/img/icons/saf-ico-128.png',
  './resources/img/icons/saf-ico-144.png',
  './resources/img/icons/saf-ico-192.png',
  './resources/img/icons/user.svg',
  './resources/img/tournament/car-saf.png',
  './resources/img/tournament/t-free.jpg',
  './lib/moment/moment.min.js',
  './lib/pouchdb/pouchdb-7.2.1.min.js',
  './lib/pouchdb/pouchdb.find.min.js',
  './lib/vuetify/vuetify-v2.6.2.min.js',
  './lib/vuetify/vuetify-v2.6.2.min.css',
  './lib/vue/vue.js',
  './lib/materialdesignicons/css/materialdesignicons.min.css',
  './lib/materialdesignicons/css/materialdesignicons.min.css.map',
  './lib/materialdesignicons/fonts/materialdesignicons-webfont.eot',
  './lib/materialdesignicons/fonts/materialdesignicons-webfont.ttf',
  './lib/materialdesignicons/fonts/materialdesignicons-webfont.woff',
  './lib/materialdesignicons/fonts/materialdesignicons-webfont.woff2'  
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installing');

    // Perform install steps
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(SHELL_CACHE);
        })
    );

  console.log('[Service Worker] Installed');
});

self.addEventListener('activate', function(e) {

    console.log('[Service Worker] Activating');

    e.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            console.log(cacheName);
            return (cacheName.startsWith(CACHE_PREFIX) && cacheName!=CACHE_NAME);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );

    console.log('[Service Worker] Activated');

  });


self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });


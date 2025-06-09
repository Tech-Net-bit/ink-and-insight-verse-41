
const CACHE_NAME = 'vzontech-v2';
const STATIC_CACHE_NAME = 'vzontech-static-v2';
const DYNAMIC_CACHE_NAME = 'vzontech-dynamic-v2';

const staticAssets = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/placeholder.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

const dynamicAssets = [
  '/articles',
  '/categories',
  '/about',
  '/auth'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => cache.addAll(staticAssets)),
      caches.open(DYNAMIC_CACHE_NAME).then(cache => cache.addAll(dynamicAssets))
    ])
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip non-HTTP requests
  if (!event.request.url.startsWith('http')) return;

  // Skip Supabase API requests (let them go through normally)
  if (event.request.url.includes('supabase.co')) return;

  const url = new URL(event.request.url);
  
  // Handle navigation requests (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache immediately
          fetch(event.request).then(response => {
            if (response && response.status === 200) {
              // Update cache in background
              caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                cache.put(event.request, response.clone());
              });
            }
          }).catch(() => {
            // Network failed, but we already have cached version
          });
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Cache successful responses
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
    );
    return;
  }

  // Handle static assets
  if (staticAssets.some(asset => url.pathname.includes(asset.replace('/', '')))) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Handle other requests (images, API calls, etc.)
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cache images and other assets
        if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|css|js)$/)) {
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handle background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any pending operations when back online
  console.log('Background sync triggered');
}

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    });
  }
});

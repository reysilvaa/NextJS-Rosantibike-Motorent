// Nama cache untuk asset statis
const CACHE_NAME = 'rosantibike-cache-v2';
const RUNTIME_CACHE = 'rosantibike-runtime-v2';
const IMAGE_CACHE = 'rosantibike-images-v2';

// List asset yang akan di-cache saat service worker dipasang
const urlsToCache = [
  '/',
  '/offline.html',
  '/site.webmanifest',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/placeholder.svg',
  // Font files
  '/fonts/inter-var.woff2',
  // Tambahkan CSS kritikal jika ada
  '/styles.css',
  // Logo untuk offline page
  '/logo/logo1.svg',
  '/logo/logo2.svg',
  // Tambahan assets untuk mobile
  '/motorcycle-placeholder.jpg',
  '/motorcycle-bg.svg',
];

// Asset kritikal yang harus tersedia di halaman beranda
const CRITICAL_HOME_ASSETS = [
  '/fonts/inter-var.woff2',
  '/_next/static/css/app/layout.css', // Adjust this path as needed
];

// Helper untuk memvalidasi URL yang aman untuk di-cache
function isValidCacheUrl(url) {
  // Hanya cache HTTP/HTTPS URLs, tolak chrome-extension dan skema lainnya
  return url.startsWith('http:') || url.startsWith('https:');
}

// Helper untuk caching yang lebih baik - tidak gagal jika 1 file tidak tersedia
async function cacheUrls(cache, urls) {
  const failedUrls = [];

  await Promise.all(
    urls.map(async url => {
      try {
        await cache.add(url);
      } catch (error) {
        console.warn(`Gagal meng-cache: ${url}`, error);
        failedUrls.push(url);
      }
    })
  );

  return {
    success: urls.length - failedUrls.length,
    failed: failedUrls.length,
    failedUrls,
  };
}

// Pemasangan service worker - versi yang lebih baik untuk mobile
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async cache => {
        console.log('Cache dibuka');

        // Pastikan offline.html selalu terinstall terlebih dahulu
        try {
          await cache.add('/offline.html');
          console.log('offline.html berhasil di-cache');
        } catch (err) {
          console.warn('Gagal meng-cache offline.html:', err);
        }

        // Gunakan metode yang lebih baik untuk caching - tidak akan gagal jika 1 file tidak ada
        const result = await cacheUrls(cache, urlsToCache);
        console.log(`Berhasil cache ${result.success} file, gagal ${result.failed} file`);

        // Mencoba kembali file yang gagal cache dengan versi yang lebih sederhana
        if (result.failedUrls.length > 0) {
          console.log('Mencoba kembali file yang gagal di-cache...');
          await Promise.allSettled(
            result.failedUrls.map(url =>
              fetch(url)
                .then(response => {
                  if (response.ok) {
                    return cache.put(url, response);
                  }
                  throw new Error(`Gagal fetch ${url}: ${response.status}`);
                })
                .catch(err => console.warn(`Gagal retry cache ${url}:`, err))
            )
          );
        }

        return result;
      })
      .then(() => self.skipWaiting()) // Aktifkan langsung SW baru
      .catch(error => {
        console.error('Gagal menginstall service worker:', error);
        // Tetap lanjutkan instalasi meskipun gagal cache
        return self.skipWaiting();
      })
  );
});

// Aktivasi service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Ambil alih klien yang sedang terbuka
  );
});

// Helper function untuk mengecek apakah ini halaman beranda
function isHomePage(url) {
  const pathname = new URL(url).pathname;
  return pathname === '/' || pathname === '/index.html';
}

// Cache gambar dengan cache terpisah dan TTL (1 minggu)
async function cacheImage(request, response) {
  // Pastikan URL valid untuk di-cache
  if (!isValidCacheUrl(request.url)) {
    return response;
  }

  const cache = await caches.open(IMAGE_CACHE);
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);

  // Tambahkan timestamp untuk TTL 1 minggu
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 hari
  headers.append('sw-cache-expiry', expiry);

  const responseToCache = new Response(await clonedResponse.blob(), {
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers,
  });

  cache.put(request, responseToCache);
  return response;
}

// Strategi cache-first untuk asset statis, network-first untuk API
self.addEventListener('fetch', event => {
  const request = event.request;
  let url;

  try {
    url = new URL(request.url);
  } catch (error) {
    // URL tidak valid, abaikan
    return;
  }

  // Skip permintaan dengan skema yang tidak valid (chrome-extension, dll)
  if (!isValidCacheUrl(request.url)) {
    return; // Tidak menangani permintaan dengan skema yang tidak valid
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return; // Tidak menangani permintaan cross-origin sama sekali
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Jika halaman beranda, gunakan strategi network-first untuk HTML
  // tapi cache-first untuk critical assets
  if (isHomePage(request.url) && request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response
          const responseToCache = response.clone();

          // Update cache
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });

          // Pre-cache critical home assets
          caches.open(CACHE_NAME).then(cache => {
            CRITICAL_HOME_ASSETS.forEach(asset => {
              // Pastikan asset adalah URL yang valid
              try {
                const assetUrl = new URL(asset, self.location.origin).href;
                if (isValidCacheUrl(assetUrl)) {
                  fetch(asset)
                    .then(assetResponse => {
                      cache.put(new Request(asset), assetResponse);
                    })
                    .catch(() => {
                      // Ignore errors
                    });
                }
              } catch (error) {
                console.warn(`URL tidak valid: ${asset}`);
              }
            });
          });

          return response;
        })
        .catch(() => {
          return caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Jika offline dan tidak ada cache, tampilkan offline page
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Handle gambar dan asset statis dengan cache-first
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'script' ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff')
  ) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          // Check if expired for images
          if (request.destination === 'image') {
            const expiry = response.headers.get('sw-cache-expiry');
            if (expiry && parseInt(expiry) < Date.now()) {
              // Image expired, fetch new one
              return fetch(request)
                .then(newResponse => cacheImage(request, newResponse))
                .catch(() => response); // Fallback to expired image if network fails
            }
          }
          return response;
        }

        return fetch(request)
          .then(fetchResponse => {
            // Cache hasil fetch jika sukses
            if (fetchResponse && fetchResponse.status === 200) {
              if (request.destination === 'image') {
                return cacheImage(request, fetchResponse);
              } else {
                const responseToCache = fetchResponse.clone();
                caches.open(RUNTIME_CACHE).then(cache => {
                  // Pastikan URL valid untuk di-cache
                  if (isValidCacheUrl(request.url)) {
                    cache.put(request, responseToCache);
                  }
                });
              }
            }
            return fetchResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // Jika offline dan tidak ada di cache, berikan fallback image
            if (request.destination === 'image') {
              return caches.match('/placeholder.svg');
            }
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
    );
    return;
  }

  // Network-first untuk API dan dynamic content
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => caches.match(request))
    );
    return;
  }

  // Strategi default: stale-while-revalidate untuk navigasi dan konten HTML
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request)
          .then(networkResponse => {
            // Cache halaman HTML baru jika berhasil di-fetch
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Jika offline dan tidak ada di cache, tampilkan offline page
            return caches.match('/offline.html');
          });

        // Gunakan cache jika ada sementara fetch berjalan
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategi default: network-first, fall back to cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache response jika berhasil
        if (response && response.status === 200 && request.method === 'GET') {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            // Tambahan pemeriksaan untuk URL yang valid
            if (isValidCacheUrl(request.url)) {
              cache.put(request, responseToCache);
            }
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Saat tidak ada koneksi dan content tidak di cache, tampilkan halaman offline
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});

// Handle pesan dari klien
self.addEventListener('message', event => {
  // Periksa apakah pesan adalah untuk skip waiting
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Tambahkan event fetch khusus untuk manifest
self.addEventListener('fetch', event => {
  if (
    event.request.url.endsWith('/site.webmanifest') ||
    event.request.url.endsWith('/manifest.json')
  ) {
    // Cache manifest file secara konsisten
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
  }
});

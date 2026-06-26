const CACHE_NAME = 'zgen-pwa-v1'
const APP_SHELL_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './pwa-192x192.png',
  './pwa-512x512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok && networkResponse.type === 'basic') {
      const cache = await caches.open(CACHE_NAME)
      await cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch {
    return Response.error()
  }
}

async function navigationFallback(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      await cache.put('./index.html', networkResponse.clone())
    }

    return networkResponse
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match('./index.html')) ||
      (await caches.match('./')) ||
      Response.error()
    )
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin || url.pathname.endsWith('/sw.js')) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(navigationFallback(request))
    return
  }

  event.respondWith(cacheFirst(request))
})

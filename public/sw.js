// Service Worker for caching and offline functionality
const CACHE_NAME = 'thesundaytraveller-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/images/logo.svg',
  '/fonts/inter-var.woff2',
  '/api/auth/session' // Check if user is logged in
]

// Assets to cache on demand
const CACHE_STRATEGY = {
  '/api/posts': 'networkFirst',
  '/api/categories': 'networkFirst',
  '/api/tags': 'networkFirst',
  '/api/users': 'networkFirst',
  '/images/': 'cacheFirst',
  '/fonts/': 'cacheFirst',
  '/_next/static/': 'cacheFirst'
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return
  }

  // Skip admin routes for caching
  if (url.pathname.startsWith('/admin') && request.method === 'POST') {
    return
  }

  // Determine caching strategy
  const strategy = getCacheStrategy(request.url)

  switch (strategy) {
    case 'cacheFirst':
      event.respondWith(cacheFirst(request))
      break
    case 'networkFirst':
      event.respondWith(networkFirst(request))
      break
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request))
      break
    default:
      event.respondWith(networkFirst(request))
  }
})

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.error('Cache-first strategy failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)

    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/')
      if (offlineResponse) {
        return offlineResponse
      }
    }

    return new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// Stale-while-revalidate strategy (for frequently updated content)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await caches.match(request)

  // Start network request (don't await it)
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch((error) => {
      console.log('Stale-while-revalidate network failed:', error)
    })

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse
  }

  // Wait for network response if no cache
  return networkPromise
}

// Determine cache strategy based on URL
function getCacheStrategy(url) {
  for (const [pattern, strategy] of Object.entries(CACHE_STRATEGY)) {
    if (url.includes(pattern)) {
      return strategy
    }
  }

  // Default strategies based on request type
  if (url.includes('/api/')) {
    return 'networkFirst'
  }

  if (url.includes('/_next/static/') || url.includes('/images/') || url.includes('/fonts/')) {
    return 'cacheFirst'
  }

  return 'networkFirst'
}

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background tasks
      performBackgroundTasks()
    )
  }
})

// Perform background tasks
async function performBackgroundTasks() {
  try {
    // Sync any pending data
    console.log('Performing background sync tasks')

    // You can add custom background sync logic here
    // For example, sync offline form submissions, analytics data, etc.

  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)

  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/images/logo-192x192.png',
      badge: '/images/badge-72x72.png',
      tag: data.tag || 'notification',
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || []
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)

  event.notification.close()

  if (event.action) {
    // Handle action buttons
    console.log('Action clicked:', event.action)
  } else {
    // Handle notification body click
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    )
  }
})

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync triggered:', event.tag)

  if (event.tag === 'content-sync') {
    event.waitUntil(
      syncContent()
    )
  }
})

// Sync content in background
async function syncContent() {
  try {
    // Sync latest content for offline reading
    const response = await fetch('/api/posts?limit=10&status=published')
    if (response.ok) {
      const posts = await response.json()
      const cache = await caches.open(DYNAMIC_CACHE)

      // Cache the latest posts for offline reading
      for (const post of posts) {
        cache.put(`/api/posts/${post.id}`, new Response(JSON.stringify(post)))
      }
    }
  } catch (error) {
    console.error('Content sync failed:', error)
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.ports[0].postMessage({
      staticCache: STATIC_CACHE,
      dynamicCache: DYNAMIC_CACHE,
      cacheNames: ['static-v1', 'dynamic-v1']
    })
  }
})
import { LRUCache } from 'lru-cache'

// Database Query Optimization
export class QueryOptimizer {
  private static cache = new LRUCache<string, any>({
    max: 1000,
    ttl: 5 * 60 * 1000, // 5 minutes
  })

  static getCacheKey(query: string, params: any[]): string {
    return `${query}:${JSON.stringify(params)}`
  }

  static async cachedQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttlMinutes: number = 5
  ): Promise<T> {
    const cached = this.cache.get(key)
    if (cached !== undefined) {
      return cached
    }

    const result = await queryFn()
    this.cache.set(key, result, { ttl: ttlMinutes * 60 * 1000 })
    return result
  }

  static invalidateCache(pattern: string): void {
    const keys = Array.from(this.cache.keys())
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    })
  }

  static clearCache(): void {
    this.cache.clear()
  }

  static getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      calculatedSize: this.cache.calculatedSize
    }
  }
}

// Image Optimization
export class ImageOptimizer {
  static optimizeImageUrl(
    url: string,
    width?: number,
    height?: number,
    quality: number = 80,
    format: 'webp' | 'avif' | 'jpg' | 'png' = 'webp'
  ): string {
    if (!url) return url

    // If it's already an optimized URL, return as is
    if (url.includes('w_') || url.includes('h_')) {
      return url
    }

    // For external URLs, return as is
    if (url.startsWith('http') && !url.includes('localhost')) {
      return url
    }

    // Build optimization parameters
    const params = new URLSearchParams()

    if (width) params.append('w', width.toString())
    if (height) params.append('h', height.toString())
    if (quality !== 80) params.append('q', quality.toString())
    if (format !== 'webp') params.append('f', format)

    // Add auto format and compression
    params.append('auto', 'format,compress')

    return `${url}?${params.toString()}`
  }

  static getResponsiveImageSrcSet(
    baseUrl: string,
    widths: number[] = [320, 640, 768, 1024, 1280, 1536]
  ): string {
    return widths
      .map(width => {
        const optimizedUrl = this.optimizeImageUrl(baseUrl, width)
        return `${optimizedUrl} ${width}w`
      })
      .join(', ')
  }

  static getPlaceholderImage(width: number, height: number, text: string = 'Loading...'): string {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle" dy=".3em">
          ${text}
        </text>
      </svg>
    `).toString('base64')}`
  }
}

// Performance Monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map()
  private static startTimes: Map<string, number> = new Map()

  static startTimer(label: string): void {
    this.startTimes.set(label, performance.now())
  }

  static endTimer(label: string): number {
    const startTime = this.startTimes.get(label)
    if (!startTime) {
      console.warn(`Timer ${label} was not started`)
      return 0
    }

    const duration = performance.now() - startTime
    this.startTimes.delete(label)

    // Store metric
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    this.metrics.get(label)!.push(duration)

    // Keep only last 100 measurements
    const measurements = this.metrics.get(label)!
    if (measurements.length > 100) {
      measurements.shift()
    }

    return duration
  }

  static getMetrics(label: string): { count: number; avg: number; min: number; max: number; last: number } | null {
    const measurements = this.metrics.get(label)
    if (!measurements || measurements.length === 0) {
      return null
    }

    const count = measurements.length
    const sum = measurements.reduce((a, b) => a + b, 0)
    const avg = sum / count
    const min = Math.min(...measurements)
    const max = Math.max(...measurements)
    const last = measurements[measurements.length - 1]

    return { count, avg, min, max, last }
  }

  static getAllMetrics(): Record<string, any> {
    const allMetrics: Record<string, any> = {}

    Array.from(this.metrics.entries()).forEach(([label, measurements]) => {
      if (measurements.length > 0) {
        const count = measurements.length
        const sum = measurements.reduce((a: number, b: number) => a + b, 0)
        const avg = sum / count
        const min = Math.min(...measurements)
        const max = Math.max(...measurements)
        const last = measurements[measurements.length - 1]

        allMetrics[label] = { count, avg, min, max, last }
      }
    })

    return allMetrics
  }

  static logSlowQueries(thresholdMs: number = 100): void {
    const slowQueries: string[] = []

    Array.from(this.metrics.entries()).forEach(([label, measurements]) => {
      const maxTime = Math.max(...measurements)
      if (maxTime > thresholdMs) {
        slowQueries.push(`${label}: ${maxTime.toFixed(2)}ms`)
      }
    })

    if (slowQueries.length > 0) {
      console.warn('Slow queries detected:', slowQueries)
    }
  }
}

// Resource Preloading
export class ResourcePreloader {
  private static preloadedResources = new Set<string>()

  static preloadImage(url: string, as: 'image' = 'image'): void {
    if (this.preloadedResources.has(url)) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = as
    link.href = url
    document.head.appendChild(link)

    this.preloadedResources.add(url)
  }

  static preloadScript(url: string): void {
    if (this.preloadedResources.has(url)) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'script'
    link.href = url
    document.head.appendChild(link)

    this.preloadedResources.add(url)
  }

  static preloadStylesheet(url: string): void {
    if (this.preloadedResources.has(url)) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = url
    document.head.appendChild(link)

    this.preloadedResources.add(url)
  }

  static prefetchResource(url: string): void {
    if (this.preloadedResources.has(url)) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)

    this.preloadedResources.add(url)
  }

  static preloadCriticalResources(): void {
    // Preload critical fonts
    this.preloadStylesheet('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap')

    // Preload critical images (if any)
    // this.preloadImage('/images/hero-background.jpg')
  }
}

// Memory Management
export class MemoryManager {
  private static cleanupFunctions: (() => void)[] = []

  static addCleanupFunction(fn: () => void): void {
    this.cleanupFunctions.push(fn)
  }

  static removeCleanupFunction(fn: () => void): void {
    const index = this.cleanupFunctions.indexOf(fn)
    if (index > -1) {
      this.cleanupFunctions.splice(index, 1)
    }
  }

  static cleanup(): void {
    this.cleanupFunctions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('Cleanup function error:', error)
      }
    })

    // Clear performance monitor metrics
    PerformanceMonitor['metrics'].clear()
    PerformanceMonitor['startTimes'].clear()

    // Clear query cache
    QueryOptimizer.clearCache()

    // Clear preloaded resources
    ResourcePreloader['preloadedResources'].clear()

    console.log('Memory cleanup completed')
  }

  static getMemoryUsage(): { used: number; total: number; limit: number } | null {
    // Check if performance.memory is available (Chrome/Edge)
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }

    return null
  }
}

// Lazy Loading Manager
export class LazyLoadManager {
  private static observer: IntersectionObserver | null = null
  private static observedElements = new Map<Element, () => void>()

  static init(): void {
    if (this.observer) return

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = this.observedElements.get(entry.target)
            if (callback) {
              callback()
              this.observer?.unobserve(entry.target)
              this.observedElements.delete(entry.target)
            }
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )
  }

  static observe(element: Element, callback: () => void): void {
    if (!this.observer) {
      this.init()
    }

    this.observedElements.set(element, callback)
    this.observer?.observe(element)
  }

  static unobserve(element: Element): void {
    this.observer?.unobserve(element)
    this.observedElements.delete(element)
  }

  static disconnect(): void {
    this.observer?.disconnect()
    this.observedElements.clear()
    this.observer = null
  }
}

// Service Worker Registration
export class ServiceWorkerManager {
  static async register(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered successfully:', registration.scope)

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('New version available! Refresh to update.')
              }
            })
          }
        })

        return registration
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return null
      }
    }

    return null
  }

  static async unregister(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map(reg => reg.unregister()))
        console.log('Service Workers unregistered successfully')
        return true
      } catch (error) {
        console.error('Service Worker unregistration failed:', error)
        return false
      }
    }

    return true
  }
}

// Performance Budget Monitoring
export class PerformanceBudget {
  private static budgets: Map<string, number> = new Map()

  static setBudget(metric: string, budgetMs: number): void {
    this.budgets.set(metric, budgetMs)
  }

  static checkBudget(metric: string, actualTime: number): { withinBudget: boolean; overBy: number } {
    const budget = this.budgets.get(metric)
    if (!budget) {
      return { withinBudget: true, overBy: 0 }
    }

    const overBy = actualTime - budget
    return {
      withinBudget: overBy <= 0,
      overBy: Math.max(0, overBy)
    }
  }

  static getBudgetReport(): Record<string, { budget: number; status: 'within' | 'over' | 'unknown' }> {
    const report: Record<string, { budget: number; status: 'within' | 'over' | 'unknown' }> = {}

    Array.from(this.budgets.entries()).forEach(([metric, budget]) => {
      const metrics = PerformanceMonitor.getMetrics(metric)
      if (metrics) {
        const { withinBudget } = this.checkBudget(metric, metrics.avg)
        report[metric] = {
          budget,
          status: withinBudget ? 'within' : 'over'
        }
      } else {
        report[metric] = {
          budget,
          status: 'unknown'
        }
      }
    })

    return report
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Set up performance budgets
  PerformanceBudget.setBudget('page-load', 3000) // 3 seconds
  PerformanceBudget.setBudget('api-response', 500) // 500ms
  PerformanceBudget.setBudget('image-load', 2000) // 2 seconds
  PerformanceBudget.setBudget('component-render', 100) // 100ms

  // Initialize lazy loading
  LazyLoadManager.init()

  // Preload critical resources
  ResourcePreloader.preloadCriticalResources()

  // Register service worker in production
  if (process.env.NODE_ENV === 'production') {
    ServiceWorkerManager.register()
  }

  // Set up memory cleanup on page unload
  window.addEventListener('beforeunload', () => {
    MemoryManager.cleanup()
    LazyLoadManager.disconnect()
  })

  // Monitor performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      PerformanceMonitor.logSlowQueries(100)
    }, 1000)
  })
}
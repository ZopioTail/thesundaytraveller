import { NextRequest, NextResponse } from 'next/server'
import { QueryOptimizer } from '@/lib/performance'

export interface CacheOptions {
  ttl?: number // Time to live in minutes
  key?: string // Custom cache key
  revalidate?: boolean // Force revalidation
  tags?: string[] // Cache tags for invalidation
}

export class APICache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number; tags: string[] }>()

  static async cachedResponse<T>(
    request: NextRequest,
    cacheOptions: CacheOptions,
    fetchFunction: () => Promise<T>
  ): Promise<T> {
    const cacheKey = cacheOptions.key || this.generateCacheKey(request, cacheOptions)
    const cached = this.cache.get(cacheKey)

    // Check if cache is valid
    if (cached && !cacheOptions.revalidate) {
      const now = Date.now()
      if (now - cached.timestamp < cached.ttl * 60 * 1000) {
        return cached.data
      }
    }

    // Fetch fresh data
    const data = await fetchFunction()

    // Cache the response
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: cacheOptions.ttl || 5,
      tags: cacheOptions.tags || []
    })

    return data
  }

  static invalidateByTag(tags: string[]): void {
    Array.from(this.cache.entries()).forEach(([key, cached]) => {
      if (tags.some(tag => cached.tags.includes(tag))) {
        this.cache.delete(key)
      }
    })
  }

  static invalidateByPattern(pattern: string): void {
    Array.from(this.cache.keys()).forEach(key => {
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
      keys: Array.from(this.cache.keys())
    }
  }

  private static generateCacheKey(request: NextRequest, options: CacheOptions): string {
    const url = new URL(request.url)
    const baseKey = `${request.method}:${url.pathname}${url.search}`

    if (options.key) {
      return `${baseKey}:${options.key}`
    }

    return baseKey
  }
}

// Higher-order function for caching API routes
export function withCache<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  cacheOptions: CacheOptions = {}
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // For GET requests, try to serve from cache
      if (request.method === 'GET') {
        const cachedData = await APICache.cachedResponse(
          request,
          cacheOptions,
          async () => {
            const response = await handler(request, ...args)
            return await response.json()
          }
        )

        return NextResponse.json(cachedData)
      }

      // For other methods, execute normally and invalidate cache
      const response = await handler(request, ...args)

      // Invalidate related cache entries
      if (cacheOptions.tags) {
        APICache.invalidateByTag(cacheOptions.tags)
      }

      return response

    } catch (error) {
      console.error('Cache wrapper error:', error)
      return await handler(request, ...args)
    }
  }
}

// Database query caching decorator
export function cacheQuery(ttlMinutes: number = 5, key?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = key || `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`

      return QueryOptimizer.cachedQuery(
        cacheKey,
        () => method.apply(this, args),
        ttlMinutes
      )
    }

    return descriptor
  }
}

// Cache invalidation utilities
export class CacheInvalidator {
  static invalidatePosts(): void {
    APICache.invalidateByPattern('posts')
    QueryOptimizer.invalidateCache('posts')
  }

  static invalidateUsers(): void {
    APICache.invalidateByPattern('users')
    QueryOptimizer.invalidateCache('users')
  }

  static invalidateComments(): void {
    APICache.invalidateByPattern('comments')
    QueryOptimizer.invalidateCache('comments')
  }

  static invalidateCategories(): void {
    APICache.invalidateByPattern('categories')
    QueryOptimizer.invalidateCache('categories')
  }

  static invalidateTags(): void {
    APICache.invalidateByPattern('tags')
    QueryOptimizer.invalidateCache('tags')
  }

  static invalidateMedia(): void {
    APICache.invalidateByPattern('media')
    QueryOptimizer.invalidateCache('media')
  }

  static invalidateAnalytics(): void {
    APICache.invalidateByPattern('analytics')
    QueryOptimizer.invalidateCache('analytics')
  }

  static invalidateNewsletter(): void {
    APICache.invalidateByPattern('newsletter')
    QueryOptimizer.invalidateCache('newsletter')
  }

  static invalidateAll(): void {
    APICache.clearCache()
    QueryOptimizer.clearCache()
  }
}
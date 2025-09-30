import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { CSRFProtection, RateLimiter, SecurityHeaders, SecurityLogger } from '@/lib/security'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Apply security headers to all responses
  const response = NextResponse.next()
  const securityHeaders = { ...SecurityHeaders.getDefaultHeaders(), ...SecurityHeaders.getCSPHeaders() }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Skip security checks for static files and API routes that don't need protection
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.includes('.') ||
    pathname.startsWith('/public/')
  ) {
    return response
  }

  // Get client IP for rate limiting
  const clientIP = RateLimiter.getClientIP(request)

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = RateLimiter.checkLimit(clientIP)

    if (!rateLimitResult.allowed) {
      SecurityLogger.logRateLimitExceeded(clientIP, clientIP, request.headers.get('user-agent') || 'unknown')

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RateLimiter['MAX_REQUESTS'].toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      )
    }

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', RateLimiter['MAX_REQUESTS'].toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
  }

  // CSRF protection for state-changing operations
  const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)

  if (isWriteOperation && pathname.startsWith('/api/')) {
    // Skip CSRF check for authentication endpoints
    if (!pathname.startsWith('/api/auth/')) {
      const isValidCSRF = CSRFProtection.validateToken(request)

      if (!isValidCSRF) {
        SecurityLogger.logCSRFViolation(clientIP, request.headers.get('user-agent') || 'unknown')

        return NextResponse.json(
          { error: 'CSRF token validation failed' },
          { status: 403 }
        )
      }
    }
  }

  // Admin routes protection (exclude login page)
  if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
    try {
      const token = await getToken({ req: request })

      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Check if user has admin role
      if (token.role !== 'admin' && token.role !== 'editor' && token.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Clean up old rate limit entries periodically
  if (Math.random() < 0.01) { // 1% chance on each request
    RateLimiter.cleanup()
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
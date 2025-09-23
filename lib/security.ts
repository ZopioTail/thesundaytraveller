import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

// CSRF Protection
export class CSRFProtection {
  private static readonly CSRF_TOKEN_HEADER = 'x-csrf-token'
  private static readonly CSRF_TOKEN_COOKIE = 'csrf-token'

  static generateToken(): string {
    return crypto.randomUUID()
  }

  static setTokenCookie(response: Response, token: string): Response {
    response.headers.set('Set-Cookie', `${this.CSRF_TOKEN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Secure`)
    return response
  }

  static validateToken(request: NextRequest): boolean {
    const token = request.headers.get(this.CSRF_TOKEN_HEADER)
    const cookieToken = request.cookies.get(this.CSRF_TOKEN_COOKIE)?.value

    if (!token || !cookieToken) {
      return false
    }

    return token === cookieToken
  }

  static getTokenFromRequest(request: NextRequest): string | null {
    return request.headers.get(this.CSRF_TOKEN_HEADER)
  }
}

// Input Validation
export class InputValidator {
  static sanitizeString(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string')
    }

    // Remove potentially dangerous characters
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()

    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength)
    }

    return sanitized
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  static validateURL(url: string): boolean {
    try {
      const parsedUrl = new URL(url)
      return ['http:', 'https:'].includes(parsedUrl.protocol)
    } catch {
      return false
    }
  }

  static validateSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9-]+$/
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    return usernameRegex.test(username) && username.length >= 3 && username.length <= 50
  }
}

// Rate Limiting
export class RateLimiter {
  private static readonly WINDOW_MS = 15 * 60 * 1000 // 15 minutes
  private static readonly MAX_REQUESTS = 100 // requests per window
  private static requests = new Map<string, { count: number; resetTime: number }>()

  static checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const windowKey = this.getWindowKey(now)
    const requestKey = `${identifier}:${windowKey}`

    let requestData = this.requests.get(requestKey)

    if (!requestData || now > requestData.resetTime) {
      requestData = {
        count: 0,
        resetTime: now + this.WINDOW_MS
      }
    }

    requestData.count++

    if (requestData.count > this.MAX_REQUESTS) {
      this.requests.set(requestKey, requestData)
      return {
        allowed: false,
        remaining: 0,
        resetTime: requestData.resetTime
      }
    }

    this.requests.set(requestKey, requestData)

    return {
      allowed: true,
      remaining: this.MAX_REQUESTS - requestData.count,
      resetTime: requestData.resetTime
    }
  }

  static getClientIP(request: NextRequest): string {
    // Try different headers for IP detection
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfConnectingIP = request.headers.get('cf-connecting-ip')

    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }

    if (realIP) {
      return realIP
    }

    if (cfConnectingIP) {
      return cfConnectingIP
    }

    return request.ip || 'unknown'
  }

  private static getWindowKey(timestamp: number): string {
    return Math.floor(timestamp / this.WINDOW_MS).toString()
  }

  static cleanup(): void {
    const now = Date.now()
    Array.from(this.requests.entries()).forEach(([key, data]) => {
      if (now > data.resetTime) {
        this.requests.delete(key)
      }
    })
  }
}

// Security Headers
export class SecurityHeaders {
  static getDefaultHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    }
  }

  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted.cdn.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https: blob:;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://api.example.com wss: ws:;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim()
    }
  }
}

// Security Audit Logger
export class SecurityLogger {
  static logSuspiciousActivity(
    type: string,
    details: Record<string, any>,
    ip: string,
    userAgent: string
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      details,
      ip,
      userAgent,
      severity: 'warning'
    }

    // In production, this would be sent to a security monitoring service
    console.warn('Security Event:', logEntry)

    // Store in database for audit trail
    // await db.insert(securityLogs).values(logEntry)
  }

  static logFailedLogin(email: string, ip: string, userAgent: string): void {
    this.logSuspiciousActivity('failed_login', { email }, ip, userAgent)
  }

  static logCSRFViolation(ip: string, userAgent: string): void {
    this.logSuspiciousActivity('csrf_violation', {}, ip, userAgent)
  }

  static logRateLimitExceeded(identifier: string, ip: string, userAgent: string): void {
    this.logSuspiciousActivity('rate_limit_exceeded', { identifier }, ip, userAgent)
  }
}
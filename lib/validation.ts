import { InputValidator, SecurityLogger } from '@/lib/security'
import { NextRequest } from 'next/server'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedData?: any
}

export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'slug' | 'password' | 'username'
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    sanitize?: boolean
  }
}

export class RequestValidator {
  static validateBody(request: NextRequest, schema: ValidationSchema): ValidationResult {
    try {
      const contentType = request.headers.get('content-type')

      if (!contentType?.includes('application/json')) {
        return {
          isValid: false,
          errors: ['Content-Type must be application/json']
        }
      }

      const body = request.body
      if (!body) {
        return {
          isValid: false,
          errors: ['Request body is required']
        }
      }

      // Note: In Next.js App Router, we need to parse the body differently
      // This is a placeholder for actual body parsing
      const data = {} as any // This would be parsed from request.json()

      return this.validateObject(data, schema)
    } catch (error) {
      return {
        isValid: false,
        errors: ['Invalid JSON in request body']
      }
    }
  }

  static validateQuery(request: NextRequest, schema: ValidationSchema): ValidationResult {
    const { searchParams } = new URL(request.url)
    const data: any = {}

    for (const [key, rules] of Object.entries(schema)) {
      const value = searchParams.get(key)
      if (value !== null) {
        data[key] = value
      }
    }

    return this.validateObject(data, schema)
  }

  static validateObject(data: any, schema: ValidationSchema): ValidationResult {
    const errors: string[] = []
    const sanitizedData: any = {}

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field]
      const fieldErrors: string[] = []

      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${field} is required`)
        continue
      }

      // Skip validation if field is not required and empty
      if (!rules.required && (value === undefined || value === null || value === '')) {
        continue
      }

      // Type-specific validation
      switch (rules.type) {
        case 'string':
          if (typeof value !== 'string') {
            fieldErrors.push(`${field} must be a string`)
          } else {
            if (rules.minLength && value.length < rules.minLength) {
              fieldErrors.push(`${field} must be at least ${rules.minLength} characters`)
            }
            if (rules.maxLength && value.length > rules.maxLength) {
              fieldErrors.push(`${field} must be at most ${rules.maxLength} characters`)
            }
            if (rules.pattern && !rules.pattern.test(value)) {
              fieldErrors.push(`${field} format is invalid`)
            }
            if (rules.sanitize !== false) {
              sanitizedData[field] = InputValidator.sanitizeString(value, rules.maxLength || 1000)
            } else {
              sanitizedData[field] = value
            }
          }
          break

        case 'number':
          const numValue = Number(value)
          if (isNaN(numValue)) {
            fieldErrors.push(`${field} must be a valid number`)
          } else {
            sanitizedData[field] = numValue
          }
          break

        case 'boolean':
          if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
            fieldErrors.push(`${field} must be a boolean`)
          } else {
            sanitizedData[field] = value === 'true' || value === true
          }
          break

        case 'email':
          if (typeof value !== 'string') {
            fieldErrors.push(`${field} must be a string`)
          } else if (!InputValidator.validateEmail(value)) {
            fieldErrors.push(`${field} must be a valid email address`)
          } else {
            sanitizedData[field] = rules.sanitize !== false ? InputValidator.sanitizeString(value) : value
          }
          break

        case 'url':
          if (typeof value !== 'string') {
            fieldErrors.push(`${field} must be a string`)
          } else if (!InputValidator.validateURL(value)) {
            fieldErrors.push(`${field} must be a valid URL`)
          } else {
            sanitizedData[field] = value
          }
          break

        case 'slug':
          if (typeof value !== 'string') {
            fieldErrors.push(`${field} must be a string`)
          } else if (!InputValidator.validateSlug(value)) {
            fieldErrors.push(`${field} must be a valid slug (lowercase letters, numbers, hyphens only)`)
          } else {
            sanitizedData[field] = value
          }
          break

        case 'password':
          if (typeof value !== 'string') {
            fieldErrors.push(`${field} must be a string`)
          } else {
            const passwordValidation = InputValidator.validatePassword(value)
            if (!passwordValidation.valid) {
              fieldErrors.push(...passwordValidation.errors)
            } else {
              sanitizedData[field] = value // Don't sanitize passwords
            }
          }
          break

        case 'username':
          if (typeof value !== 'string') {
            fieldErrors.push(`${field} must be a string`)
          } else if (!InputValidator.validateUsername(value)) {
            fieldErrors.push(`${field} must be a valid username (3-50 characters, letters, numbers, underscores, hyphens only)`)
          } else {
            sanitizedData[field] = rules.sanitize !== false ? InputValidator.sanitizeString(value) : value
          }
          break
      }

      if (fieldErrors.length > 0) {
        errors.push(...fieldErrors.map(error => `${field}: ${error}`))
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: Object.keys(sanitizedData).length > 0 ? sanitizedData : undefined
    }
  }

  static logValidationError(
    endpoint: string,
    errors: string[],
    clientIP: string,
    userAgent: string
  ): void {
    SecurityLogger.logSuspiciousActivity('validation_error', {
      endpoint,
      errors,
      clientIP,
      userAgent
    }, clientIP, userAgent)
  }
}

// Common validation schemas
export const CommonSchemas = {
  createPost: {
    title: { type: 'string', required: true, minLength: 1, maxLength: 255, sanitize: true },
    content: { type: 'string', required: true, minLength: 1, sanitize: true },
    excerpt: { type: 'string', maxLength: 500, sanitize: true },
    slug: { type: 'slug', required: true },
    categoryId: { type: 'number', required: true },
    tagIds: { type: 'string' }, // JSON array
    featuredImage: { type: 'url' },
    status: { type: 'string', pattern: /^(draft|published|archived)$/ },
    isFeatured: { type: 'boolean' },
    publishedAt: { type: 'string' }, // ISO date string
    seoTitle: { type: 'string', maxLength: 60, sanitize: true },
    seoDescription: { type: 'string', maxLength: 160, sanitize: true },
    seoKeywords: { type: 'string', sanitize: true }
  } as ValidationSchema,

  createComment: {
    content: { type: 'string', required: true, minLength: 1, maxLength: 2000, sanitize: true },
    authorName: { type: 'string', required: true, minLength: 1, maxLength: 100, sanitize: true },
    authorEmail: { type: 'email', required: true },
    authorWebsite: { type: 'url' },
    postId: { type: 'number', required: true },
    parentId: { type: 'number' }
  } as ValidationSchema,

  userLogin: {
    email: { type: 'email', required: true },
    password: { type: 'password', required: true }
  } as ValidationSchema,

  userRegistration: {
    email: { type: 'email', required: true },
    password: { type: 'password', required: true },
    username: { type: 'username', required: true },
    firstName: { type: 'string', maxLength: 100, sanitize: true },
    lastName: { type: 'string', maxLength: 100, sanitize: true }
  } as ValidationSchema,

  newsletterSubscription: {
    email: { type: 'email', required: true },
    firstName: { type: 'string', maxLength: 100, sanitize: true },
    lastName: { type: 'string', maxLength: 100, sanitize: true },
    preferences: { type: 'string' } // JSON object
  } as ValidationSchema
}

// Utility function to validate file uploads
export function validateFileUpload(
  file: File | null,
  allowedTypes: string[],
  maxSizeBytes: number
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` }
  }

  if (file.size > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / 1024 / 1024)
    return { valid: false, error: `File too large. Maximum size: ${maxSizeMB}MB` }
  }

  return { valid: true }
}

// Utility function to sanitize HTML content
export function sanitizeHtmlContent(html: string): string {
  // Remove script tags and other potentially dangerous elements
  return InputValidator.sanitizeString(html, 50000)
}

// Utility function to validate and sanitize search queries
export function sanitizeSearchQuery(query: string): string {
  return InputValidator.sanitizeString(query, 200)
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .trim()
}
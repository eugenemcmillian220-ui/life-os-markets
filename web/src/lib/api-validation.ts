import { NextRequest, NextResponse } from 'next/server'

/**
 * Request validation and sanitization utilities
 */

export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'json'
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => boolean
  }
}

/**
 * Sanitize string input - remove potentially dangerous content
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeString(email, 254).toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(sanitized) ? sanitized : ''
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}

/**
 * Validate request body against schema
 */
export function validateRequestBody(
  body: any,
  schema: ValidationSchema
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a valid JSON object'] }
  }

  for (const [key, rules] of Object.entries(schema)) {
    const value = body[key]

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`Field '${key}' is required`)
      continue
    }

    if (value === undefined || value === null) {
      continue
    }

    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Field '${key}' must be a string`)
        } else {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Field '${key}' must be at least ${rules.minLength} characters`)
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Field '${key}' must not exceed ${rules.maxLength} characters`)
          }
          if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`Field '${key}' format is invalid`)
          }
        }
        break

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`Field '${key}' must be a number`)
        }
        break

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Field '${key}' must be a boolean`)
        }
        break

      case 'email':
        if (typeof value !== 'string' || !sanitizeEmail(value)) {
          errors.push(`Field '${key}' must be a valid email`)
        }
        break

      case 'url':
        if (typeof value !== 'string' || !sanitizeUrl(value)) {
          errors.push(`Field '${key}' must be a valid URL`)
        }
        break

      case 'json':
        try {
          typeof value === 'string' ? JSON.parse(value) : value
        } catch {
          errors.push(`Field '${key}' must be valid JSON`)
        }
        break
    }

    if (rules.custom && !rules.custom(value)) {
      errors.push(`Field '${key}' failed custom validation`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize request body
 */
export function sanitizeRequestBody(body: any): any {
  if (body === null || body === undefined) {
    return body
  }

  if (typeof body === 'string') {
    return sanitizeString(body)
  }

  if (typeof body === 'number' || typeof body === 'boolean') {
    return body
  }

  if (Array.isArray(body)) {
    return body.map((item) => sanitizeRequestBody(item))
  }

  if (typeof body === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(body)) {
      const sanitizedKey = sanitizeString(key, 100)
      sanitized[sanitizedKey] = sanitizeRequestBody(value)
    }
    return sanitized
  }

  return body
}

/**
 * Common validation schemas
 */
export const schemas = {
  createTask: {
    title: { type: 'string' as const, required: true, minLength: 1, maxLength: 200 },
    description: { type: 'string' as const, maxLength: 1000 },
    priority: {
      type: 'string' as const,
      custom: (v: string) => ['low', 'medium', 'high'].includes(v),
    },
    dueDate: { type: 'string' as const },
    tags: {
      type: 'json' as const,
      custom: (v: any) => Array.isArray(v) && v.every((t: any) => typeof t === 'string'),
    },
  },

  signup: {
    email: { type: 'email' as const, required: true },
    password: { type: 'string' as const, required: true, minLength: 8, maxLength: 128 },
    name: { type: 'string' as const, maxLength: 100 },
  },

  signin: {
    email: { type: 'email' as const, required: true },
    password: { type: 'string' as const, required: true },
  },
}

/**
 * Create API response
 */
export function createApiResponse(
  data: any,
  status: number = 200,
  message?: string
): Response {
  return NextResponse.json(
    {
      success: status < 400,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Create error response
 */
export function createErrorResponse(error: string | Error, status: number = 500): Response {
  const message = error instanceof Error ? error.message : String(error)

  if (status === 400 || status === 401 || status === 403) {
    console.log(`[SECURITY] API Error (${status}): ${message}`)
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Validate and sanitize request
 */
export async function validateAndSanitizeRequest(
  request: NextRequest,
  schema: ValidationSchema
): Promise<{
  valid: boolean
  body: any
  error?: { message: string; status: number }
}> {
  try {
    let body = await request.json()

    const validation = validateRequestBody(body, schema)
    if (!validation.valid) {
      return {
        valid: false,
        body: null,
        error: {
          message: `Validation failed: ${validation.errors.join('; ')}`,
          status: 400,
        },
      }
    }

    body = sanitizeRequestBody(body)

    return {
      valid: true,
      body,
    }
  } catch (error) {
    return {
      valid: false,
      body: null,
      error: {
        message: 'Invalid JSON in request body',
        status: 400,
      },
    }
  }
}

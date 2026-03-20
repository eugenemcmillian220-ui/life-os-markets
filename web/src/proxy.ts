import { type NextRequest, NextResponse } from 'next/server'

// Rate limiting helper - in-memory store (use Redis in production)
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(identifier) || []

  // Filter out old requests outside the window
  const recentRequests = timestamps.filter((ts) => now - ts < windowMs)

  if (recentRequests.length >= limit) {
    return false
  }

  recentRequests.push(now)
  rateLimitMap.set(identifier, recentRequests)
  return true
}

export function proxy(request: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Different limits for different endpoints
    let limit = 60 // Default: 60 requests per minute
    let window = 60000

    if (request.nextUrl.pathname.includes('/auth/')) {
      limit = 5 // Strict limit for auth endpoints
    } else if (request.nextUrl.pathname.includes('/market-feed')) {
      limit = 10 // Moderate limit for market data
    } else if (request.nextUrl.pathname.includes('/recommendations')) {
      limit = 20 // Moderate limit for AI recommendations
    }

    if (!checkRateLimit(ip, limit, window)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: window / 1000,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(window / 1000)),
          },
        }
      )
    }
  }

  // Create response and add security headers
  const response = NextResponse.next()

  // CORS Headers
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_APP_URL,
  ]

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  )
  response.headers.set('Access-Control-Max-Age', '86400')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.marketaux.com https://api.alphavantage.co https://events-json.gdeltproject.org https://newsapi.org https://api.groq.com https://huggingface.co https://generativelanguage.googleapis.com https://*.supabase.co; frame-ancestors 'none';"
  )

  // Additional security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')

  // Add custom headers for logging
  response.headers.set('X-Request-ID', crypto.randomUUID())
  response.headers.set('X-Client-IP', ip)

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/tasks/:path*',
    '/habits/:path*',
    '/goals/:path*',
    '/finance/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
}

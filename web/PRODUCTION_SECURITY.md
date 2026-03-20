# Life OS - Production Security Hardening Guide

## Overview
This guide walks through securing the Life OS application for production deployment, focusing on moving sensitive API keys from environment variables to Supabase Vault.

---

## Phase 1: Supabase Secrets Vault Setup

### Step 1: Access Supabase Dashboard
1. Go to https://app.supabase.com
2. Navigate to your project (project-7c64c352)
3. Click **Vault** in the left sidebar (under Settings)

### Step 2: Create Secrets in Supabase Vault
Store these secrets in Supabase Vault (NOT in .env files):

```
Secret Name: GROQ_API_KEY
Value: your_groq_api_key

Secret Name: STRIPE_SECRET_KEY
Value: sk_test_your_key (or sk_live_your_key for production)

Secret Name: STRIPE_WEBHOOK_SECRET
Value: whsec_your_webhook_secret

Secret Name: MARKETAUX_API_KEY
Value: your_marketaux_api_key

Secret Name: ALPHA_VANTAGE_API_KEY
Value: your_alpha_vantage_api_key

Secret Name: GOOGLE_API_KEY
Value: your_google_gemini_api_key

Secret Name: HF_API_KEY
Value: your_huggingface_api_key
```

### Step 3: Verify Vault Access
In Supabase SQL Editor, run:
```sql
SELECT * FROM vault.decrypted_secrets;
```

---

## Phase 2: Update Application to Use Vault Secrets

### Backend API Routes
All server-side API routes should fetch secrets from Supabase Vault:

```typescript
// src/lib/supabase/secrets.ts
import { createClient } from './server'

export async function getSecret(name: string): Promise<string> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vault')
    .select('secret')
    .eq('name', name)
    .single()

  if (error) {
    console.error(`Failed to fetch secret ${name}:`, error)
    throw new Error(`Secret not found: ${name}`)
  }

  return data.secret
}

// Cache secrets in memory for performance (rotate on deployment)
const secretCache = new Map<string, string>()

export async function getCachedSecret(name: string): Promise<string> {
  if (secretCache.has(name)) {
    return secretCache.get(name)!
  }

  const secret = await getSecret(name)
  secretCache.set(name, secret)
  return secret
}
```

### Usage in API Routes

**Example: Market Feed Route with Vault Secret**
```typescript
// src/app/api/market-feed/route.ts
import { getCachedSecret } from '@/lib/supabase/secrets'

export async function GET() {
  try {
    const marketauxKey = await getCachedSecret('MARKETAUX_API_KEY')
    
    const response = await fetch(
      `https://api.marketaux.com/v1/news/all?api_token=${marketauxKey}`
    )
    
    // ... rest of implementation
  } catch (error) {
    return Response.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
```

---

## Phase 3: Environment Variable Security

### Production Environment Variables (.env.production)
Only expose non-sensitive values to frontend:

```bash
# .env.production
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
NEXT_PUBLIC_APP_ENV=production
NODE_ENV=production
```

### Development Environment Variables (.env.local - DO NOT COMMIT)
```bash
# .env.local (local development only)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_APP_ENV=development
NODE_ENV=development

# For local testing with real APIs (optional):
GROQ_API_KEY=your_groq_api_key_for_local_testing
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### .gitignore Additions
```bash
# Environment files
.env
.env.local
.env.production
.env.*.local

# API Keys and secrets
*.key
*.pem
secrets.json
```

---

## Phase 4: CORS and Security Headers

### Add Security Headers Middleware
```typescript
// src/middleware.ts
import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // CORS Headers
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // CSP Header
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  return response
}

export const config = {
  matcher: ['/api/:path*']
}
```

---

## Phase 5: Request Validation and Rate Limiting

### API Route Template with Validation
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Rate limiting helper
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(identifier) || []
  
  const recentRequests = timestamps.filter(ts => now - ts < windowMs)
  
  if (recentRequests.length >= limit) {
    return false
  }

  recentRequests.push(now)
  rateLimitMap.set(identifier, recentRequests)
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Parse and validate request
    const body = await request.json()

    if (!body.data || typeof body.data !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitized = body.data
      .trim()
      .slice(0, 1000) // Max length
      .replace(/<script>/gi, '') // Remove script tags

    // Authenticated request
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Process request
    // ... your logic here

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Phase 6: API Key Rotation and Expiration

### Track API Key Expiration
Create a Supabase table to track API key expiration:

```sql
CREATE TABLE api_key_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  last_rotated TIMESTAMP,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'revoked'
  rotation_schedule TEXT DEFAULT '90 days' -- rotation frequency
);

INSERT INTO api_key_metadata (key_name, expires_at, rotation_schedule) VALUES
  ('GROQ_API_KEY', NOW() + INTERVAL '90 days', '90 days'),
  ('STRIPE_SECRET_KEY', NOW() + INTERVAL '1 year', 'annual'),
  ('MARKETAUX_API_KEY', NOW() + INTERVAL '180 days', '180 days');
```

### Check Expiration in Application
```typescript
// src/lib/supabase/key-manager.ts
import { createClient } from './server'

export async function checkKeyExpiration() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('api_key_metadata')
    .select('*')
    .lt('expires_at', new Date().toISOString())
    .eq('status', 'active')

  if (error) {
    console.error('Failed to check key expiration:', error)
    return []
  }

  // Alert if keys are expiring soon
  return data
}
```

---

## Phase 7: Deployment Checklist

### Pre-Deployment Security Audit
- [ ] All secrets moved to Supabase Vault
- [ ] .env files NOT committed to git (verify .gitignore)
- [ ] CORS headers configured correctly
- [ ] Rate limiting enabled on all public endpoints
- [ ] Input validation on all POST/PUT/DELETE routes
- [ ] HTTPS enforced in production
- [ ] Security headers middleware enabled
- [ ] Authentication required on protected routes
- [ ] Stripe webhook secret stored securely
- [ ] API keys have expiration dates set
- [ ] Error messages don't leak sensitive info
- [ ] Database connection string uses service role only on backend

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. In Vercel Dashboard → Settings → Environment Variables:
   - Add `NEXT_PUBLIC_APP_URL` (production URL)
   - Add `NEXT_PUBLIC_SUPABASE_URL` (from Supabase)
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase)
   - Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (from Stripe)
3. Deploy: Vercel will build and deploy automatically

### Supabase Configuration for Production
1. Enable Row Level Security (RLS) on all tables
2. Configure authentication policies
3. Set up database backups (automatic daily)
4. Enable SSL for database connections
5. Configure custom domain for Supabase URL

---

## Phase 8: Monitoring and Alerting

### Set Up Alerts
```typescript
// src/lib/monitoring/alerts.ts
export async function alertIfSecurityIssue(issue: string) {
  // Send alert via email/Slack
  const alertMessage = `🚨 Security Alert: ${issue}`
  
  // Implement based on your preference:
  // - Send email via Resend
  // - Send Slack webhook
  // - Log to external monitoring service (Sentry, DataDog)
}

// Usage in API routes
if (keysExpiringSoon.length > 0) {
  await alertIfSecurityIssue(`API keys expiring: ${keysExpiringSoon.join(', ')}`)
}
```

### Implement Logging
```typescript
// src/lib/logging.ts
export function logSecurityEvent(event: string, details: object) {
  console.log(`[SECURITY] ${new Date().toISOString()}: ${event}`, details)
  
  // In production, send to external service:
  // await sendToSentry({ event, details })
}
```

---

## Quick Reference: Migration Checklist

1. ✅ Create Supabase Vault secrets
2. ✅ Update API routes to use `getCachedSecret()`
3. ✅ Create .env.production with public values only
4. ✅ Add middleware.ts for security headers
5. ✅ Implement rate limiting on all public endpoints
6. ✅ Add input validation and sanitization
7. ✅ Create api_key_metadata table for expiration tracking
8. ✅ Update .gitignore to exclude .env files
9. ✅ Test in staging environment
10. ✅ Deploy to production with Vercel

---

## Support & Emergency Procedures

### If API Key is Compromised
1. Immediately revoke the key in the service provider (Groq, Stripe, etc.)
2. Update the secret in Supabase Vault with new key
3. Redeploy application with new key
4. Check logs for unauthorized access

### If Supabase Vault Access Fails
1. Check service role key has vault access permissions
2. Verify Supabase project status (not suspended)
3. Test vault query in SQL Editor
4. Fall back to cached values temporarily

---

Generated: 2026-03-20
Status: Ready for Production Deployment

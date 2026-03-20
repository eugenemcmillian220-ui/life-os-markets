# Life OS - Vercel Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Life OS application to Vercel, including environment configuration, database setup, and post-deployment verification.

---

## Prerequisites

- GitHub account with the Life OS repository
- Vercel account (free tier available)
- Supabase project configured with database, auth, and storage
- All API keys ready:
  - Stripe publishable key (pk_*)
  - Supabase URL and anon key
  - Market data API keys (for local testing only)

---

## Step 1: Prepare Repository

### 1.1 Ensure Code is Ready
```bash
# From project root
cd /workspace/web

# Verify no uncommitted changes
git status

# Verify build succeeds
npm run build

# Verify no TypeScript errors
npm run lint

# Verify no security issues
npm audit

# If all pass, commit final changes
git add .
git commit -m "chore: production-ready deployment"
git push origin main
```

### 1.2 Verify .gitignore
```bash
# Check .gitignore includes environment files
cat .gitignore | grep -E "\.env"
# Should output:
# .env
# .env.local
# .env.production
# .env.*.local
```

### 1.3 Create Production Environment File Locally (for reference)
```bash
# Create .env.production (for local reference only, do NOT commit)
cat > .env.production << 'ENV'
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (your actual anon key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_ENV=production
NODE_ENV=production
ENV
```

---

## Step 2: Connect Repository to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "GitHub" (recommended)
4. Authorize Vercel to access your GitHub account

### 2.2 Import Project
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Find and select your Life OS repository
4. Click "Import"

### 2.3 Configure Project Settings
**Framework Preset**: Select "Next.js"
**Root Directory**: Leave as default (or `./web` if monorepo)
**Environment Variables**: Leave empty for now (will add next)

---

## Step 3: Add Environment Variables to Vercel

### 3.1 Navigate to Environment Variables
1. In Vercel dashboard, go to: Settings → Environment Variables
2. Ensure you're in the correct project

### 3.2 Add Production Environment Variables

**Click "Add" for each variable:**

#### Public Variables (Frontend)
```
Variable Name: NEXT_PUBLIC_APP_URL
Value: https://your-production-domain.com
Environment: Production

Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production

Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc... (copy from Supabase → Settings → API)
Environment: Production

Variable Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_... (copy from Stripe → Developers → API Keys)
Environment: Production

Variable Name: NEXT_PUBLIC_APP_ENV
Value: production
Environment: Production
```

#### Server Variables (Backend)
```
Variable Name: NEXT_PUBLIC_APP_URL
Value: https://your-production-domain.com
Environment: Production

Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production

Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc... (same as above)
Environment: Production
```

### 3.3 Verify Environment Variables
- All public variables should start with `NEXT_PUBLIC_`
- Verify no secrets are exposed (secrets go in Supabase Vault, not here)
- Click "Save"

---

## Step 4: Configure Custom Domain

### 4.1 Add Domain to Vercel
1. Go to: Settings → Domains
2. Enter your custom domain: `lifeos.com` or `app.lifeos.com`
3. Click "Add"

### 4.2 Configure DNS Records

**Option A: Nameservers (Easiest)**
1. Copy Vercel's nameservers from the domain setup page
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Update nameservers to Vercel's
4. Wait 24-48 hours for DNS propagation

**Option B: CNAME Record (Faster)**
1. Copy the CNAME target from Vercel
2. In domain registrar, create CNAME record:
   - Name: `www` or subdomain
   - Value: Vercel's CNAME target
3. Click "Save"
4. Verify in Vercel dashboard (should show "Valid Configuration")

### 4.3 SSL Certificate
- Vercel automatically provisions SSL certificates
- Certificates are free and auto-renew
- HTTPS is enabled by default
- Typically takes 5-15 minutes after DNS is configured

---

## Step 5: Deploy to Production

### 5.1 Trigger Initial Deployment
1. In Vercel dashboard, go to: Deployments
2. Click "Deploy Now" or push to main branch (auto-deploys if configured)
3. Vercel will:
   - Clone repository
   - Install dependencies (`npm install`)
   - Build project (`npm run build`)
   - Deploy to edge network

### 5.2 Monitor Build Process
1. Watch the build logs in real-time
2. Expected build time: 2-5 minutes
3. Look for:
   - ✅ "Build completed"
   - ✅ "Deployment successful"
   - ✅ "Domains: https://your-domain.com"

### 5.3 Verify Deployment
```bash
# Check deployment status
curl https://your-domain.com

# Should return 200 OK with HTML content
# Check for any console errors (open DevTools in browser)
```

---

## Step 6: Supabase Configuration for Production

### 6.1 Enable Row Level Security (RLS)
```sql
-- In Supabase SQL Editor, enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_metadata ENABLE ROW LEVEL SECURITY;
```

### 6.2 Create RLS Policies
```sql
-- Users can only access their own tasks
CREATE POLICY "Users can access their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Repeat for other tables...
```

### 6.3 Configure Authentication
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email/Password (default)
3. Configure email verification:
   - Go to: Settings → Auth → Email Configuration
   - Set verification link expiry: 24 hours
   - Set token expiry: 1 hour

### 6.4 Set Up Database Backups
1. Go to: Settings → Database → Backups
2. Enable automatic backups: ✅
3. Backup frequency: Daily (recommended)
4. Retention: 7 days minimum

### 6.5 Configure SSL
1. Go to: Settings → Database
2. Verify "SSL connection mode" is enabled
3. SSL certificate auto-managed by Supabase

---

## Step 7: Stripe Configuration for Production

### 7.1 Switch Stripe to Live Mode
1. Go to https://dashboard.stripe.com
2. Click toggle: "View test data" → uncheck to see live mode
3. Note: Live mode API keys start with `pk_live_` and `sk_live_`

### 7.2 Configure Webhook
1. Go to: Developers → Webhooks
2. Click "Add an endpoint"
3. Enter endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to send:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
5. Click "Add endpoint"
6. Copy webhook secret and store in Supabase Vault

### 7.3 Store Webhook Secret in Supabase Vault
```sql
-- In Supabase SQL Editor
INSERT INTO vault.secrets (name, secret)
VALUES ('STRIPE_WEBHOOK_SECRET', 'whsec_...')
ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;
```

### 7.4 Configure Stripe Emails
1. Go to: Settings → Email and Receipts
2. Enable: "Send email receipts to customers"
3. Configure business details (name, address, etc.)

---

## Step 8: Post-Deployment Verification

### 8.1 Immediate Checks (5 minutes)
```bash
# Check API health
curl https://your-domain.com/api/health
# Expected: { "status": "ok", "database": "connected", ... }

# Check home page
curl https://your-domain.com
# Expected: 200 OK with HTML

# Check authentication endpoint
curl -X POST https://your-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"TestPass123",
    "name":"Test User"
  }'
# Expected: 201 Created with user object
```

### 8.2 Manual Testing in Browser (15 minutes)
1. Visit https://your-domain.com in browser
2. Test home page loads:
   - ✅ Logo and navigation visible
   - ✅ Pricing tiers displayed
   - ✅ No console errors (DevTools → Console)

3. Test signup flow:
   - Click "Sign Up"
   - Enter test email and password
   - Submit form
   - Verify success message

4. Test login:
   - Go to Sign In page
   - Login with created account
   - Verify redirected to dashboard

5. Test dashboard:
   - ✅ Dashboard loads
   - ✅ Market feed data visible
   - ✅ No API errors in Console

### 8.3 Monitor Vercel Logs
1. Go to: Deployments → Click current deployment
2. View "Function Logs"
3. Look for errors (red lines)
4. Expected: Minimal logs, no 5xx errors

### 8.4 Monitor Supabase Logs
1. Go to: Supabase Dashboard → Logs → Database
2. Check for errors in SQL queries
3. Verify authentication requests logged

### 8.5 Monitor Sentry (if configured)
1. Go to: Sentry Dashboard
2. Verify 0 new issues
3. Expected: No error reports in first 30 minutes

---

## Step 9: Monitoring & Maintenance

### 9.1 Set Up Monitoring
```bash
# Monitor build times and performance
Vercel Dashboard → Analytics → Web Vitals

# Expected metrics:
- First Contentful Paint (FCP): < 2s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
```

### 9.2 Enable Vercel Alerts
1. Go to: Settings → Monitoring
2. Enable email alerts for:
   - ✅ Build failures
   - ✅ Function timeouts
   - ✅ Error rate spike

### 9.3 Daily Maintenance Tasks
```bash
# Check for security updates
npm audit

# Update dependencies (weekly)
npm update

# Monitor API quota usage
# - Groq: 9,000 req/day
# - MarketAux: 100 req/day
# - Alpha Vantage: 5 req/min

# Check database size
# Supabase: Settings → Database → Usage
```

---

## Troubleshooting

### Issue: Deployment Fails with TypeScript Errors
**Solution:**
1. Verify `npm run build` succeeds locally
2. Check tsconfig.json is correct
3. Verify no @ts-ignore comments (bad practice)
4. Rollback to previous version: Deployments → Click previous → Redeploy

### Issue: Environment Variables Not Loading
**Solution:**
1. Verify all NEXT_PUBLIC_* variables are in Vercel dashboard
2. Verify no typos in variable names
3. Trigger rebuild: git push origin main
4. Check Vercel logs for variable loading

### Issue: API Returns 401 Unauthorized
**Solution:**
1. Verify Supabase ANON key is correct in Vercel
2. Verify RLS policies are set correctly
3. Check Supabase Auth is working: test signup
4. Review Supabase logs for auth errors

### Issue: Stripe Webhook Not Responding
**Solution:**
1. Verify webhook endpoint in Stripe dashboard
2. Verify webhook secret matches Supabase Vault
3. Check API logs in Vercel for webhook handler errors
4. Test webhook manually: Stripe → Webhooks → Send test event

### Issue: Slow API Responses
**Solution:**
1. Check database query performance
2. Verify cache is working (5-min secret cache)
3. Monitor external API latency
4. Consider enabling Edge Caching in Vercel

---

## Rollback Procedure

### If Production Has Critical Issues
```bash
# Quick rollback (< 2 minutes):
# 1. Go to Vercel Dashboard
# 2. Navigate to Deployments
# 3. Find previous working deployment
# 4. Click "..." → "Redeploy"

# OR from command line:
# 1. Identify last working commit hash
git log --oneline | head -5
# 2. Revert to previous commit
git revert <commit-hash>
git push origin main
# 3. Vercel will auto-deploy the reverted code
```

---

## Performance Optimization

### Enable Vercel Edge Caching
1. Add cache headers in API routes:
```typescript
response.headers.set('Cache-Control', 'max-age=3600, s-maxage=3600')
```

2. Enable Edge Functions:
   - Supabase Realtime updates
   - WebSocket connections
   - Real-time market feed

### Database Performance
1. Add indexes on frequently queried columns
2. Enable query logging to identify slow queries
3. Consider connection pooling for high traffic

### Bundle Optimization
```bash
# Analyze bundle size
npm run build

# Check bundle analysis
# Expected Next.js bundle: < 200KB (gzipped)
```

---

## Security Checklist

- [ ] All secrets in Supabase Vault (not in code)
- [ ] CORS properly configured in middleware.ts
- [ ] Rate limiting active on all endpoints
- [ ] Input validation on all POST routes
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Stripe webhook secret rotated (quarterly)
- [ ] Database backups enabled and tested
- [ ] RLS policies configured for all tables
- [ ] Authentication tokens encrypted
- [ ] Error messages sanitized (no sensitive data)

---

## Contact & Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Community Support**: GitHub Issues, Stack Overflow

---

**Generated**: 2026-03-20
**Status**: Production Deployment Ready


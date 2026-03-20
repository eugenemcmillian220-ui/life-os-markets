# Life OS - Production Deployment Checklist

## Pre-Deployment (1-2 weeks before launch)

### Security Audit
- [ ] All secrets moved to Supabase Vault (no secrets in code/git)
- [ ] `.env.local`, `.env.production` NOT committed to git
- [ ] `.gitignore` includes `.env*` files
- [ ] No API keys hardcoded in source files
- [ ] `src/middleware.ts` configured with CORS and security headers
- [ ] Rate limiting enabled on all public endpoints
- [ ] Input validation on all POST/PUT/DELETE routes
- [ ] Authentication required on protected routes
- [ ] Error messages don't leak sensitive information

### Code Quality
- [ ] TypeScript strict mode enabled (`tsconfig.json`)
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] No ESLint errors (`npm run lint` succeeds)
- [ ] No console.log statements with sensitive data
- [ ] All dependencies up to date (`npm outdated`)
- [ ] No deprecated packages in use
- [ ] No security vulnerabilities (`npm audit`)

### Database
- [ ] Supabase project created and configured
- [ ] All tables created with proper schemas
- [ ] Row Level Security (RLS) policies enabled
- [ ] Database backups configured (automatic daily)
- [ ] SSL/TLS enabled for database connections
- [ ] Connection pooling configured (if needed for scale)

### API & External Services
- [ ] MarketAux API account created and tested
- [ ] Alpha Vantage API account created and tested
- [ ] Groq API account created and tested (9K req/day limit understood)
- [ ] Google Gemini API account created and tested
- [ ] Hugging Face account created and tested
- [ ] Stripe account created (test mode first)
- [ ] All API keys stored in Supabase Vault

### Performance
- [ ] Bundle size analyzed (`npm run build` reports)
- [ ] Large assets (images, videos) optimized
- [ ] Database queries optimized (N+1 queries eliminated)
- [ ] API response times documented
- [ ] Cache strategy defined (5-min secret cache, etc.)
- [ ] CDN configured for static assets (optional but recommended)

### Testing
- [ ] Manual testing of all pages completed
- [ ] All forms tested with valid and invalid inputs
- [ ] Authentication flow tested (signup, signin, logout)
- [ ] Payment flow tested in Stripe test mode
- [ ] API rate limiting tested and working
- [ ] Error handling tested (simulate API failures)
- [ ] Mobile responsiveness verified

### Documentation
- [ ] README.md complete with setup instructions
- [ ] API documentation complete with examples
- [ ] DEPLOYMENT.md created with deployment steps
- [ ] PRODUCTION_SECURITY.md completed
- [ ] Environment variables documented (.env.example)
- [ ] Troubleshooting guide created
- [ ] Runbook for emergency procedures created

---

## Deployment Preparation (1 week before)

### Vercel Setup
- [ ] GitHub repository created and pushed
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Environment variables added to Vercel dashboard:
  - [ ] `NEXT_PUBLIC_APP_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Production domain configured in Vercel
- [ ] SSL certificate auto-provisioned (Vercel handles this)

### Supabase Production Configuration
- [ ] Database backups enabled and tested
- [ ] RLS policies enabled on all tables
- [ ] Service role key stored securely
- [ ] Anon key with limited permissions
- [ ] JWT expiration configured (1 day default)
- [ ] Password requirements configured
- [ ] Email verification enabled
- [ ] MFA optional setup available

### Stripe Production Setup
- [ ] Stripe account switched to live mode
- [ ] Live API keys obtained
- [ ] Webhook endpoint configured: `https://your-domain.com/api/stripe/webhook`
- [ ] Webhook events subscribed: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Webhook secret stored in Supabase Vault
- [ ] Tax rates configured (if applicable)
- [ ] Email receipts configured

### Domain & DNS
- [ ] Domain purchased and pointing to Vercel
- [ ] DNS records verified (CNAME for subdomain or A records)
- [ ] SSL certificate provisioned and active
- [ ] Email sending configured (SendGrid, Resend, etc.) - if needed for transactional emails

### Monitoring & Logging
- [ ] Sentry account created (error tracking)
- [ ] Sentry DSN added to environment variables
- [ ] Monitoring dashboard set up
- [ ] Alert thresholds configured (error rate, performance)
- [ ] Log aggregation service configured (optional)

---

## Deployment Day

### Pre-Launch (2 hours before)
- [ ] Verify all environment variables in Vercel dashboard
- [ ] Verify Supabase production database accessible
- [ ] Verify Stripe webhook configured and responding
- [ ] Test API health endpoint: `GET /api/health`
- [ ] Test market feed endpoint: `GET /api/market-feed`
- [ ] Test authentication: POST /api/auth/signup with test user
- [ ] Verify error handling with intentional errors

### Deploy to Production
```bash
# Ensure all code is committed
git status  # Must be clean

# Push to main branch (if using CI/CD)
git push origin main

# Vercel will automatically deploy
# Monitor: https://vercel.com/dashboard
```

### Post-Deployment (30 minutes after)
- [ ] Visit production URL and verify home page loads
- [ ] Check Network tab (no 5xx errors)
- [ ] Check Console tab (no JavaScript errors)
- [ ] Test signup flow end-to-end
- [ ] Verify email verification (if configured)
- [ ] Test login with created account
- [ ] Verify dashboard loads with real data
- [ ] Check `/api/health` returns 200
- [ ] Monitor error rates in Sentry (should be 0)

### Smoke Tests (Comprehensive)
```bash
# API Health
curl https://your-domain.com/api/health

# Market Feed
curl https://your-domain.com/api/market-feed

# Authentication
curl -X POST https://your-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'
```

---

## Post-Deployment (First 24 hours)

### Monitoring
- [ ] Error rate in Sentry (target: < 0.1%)
- [ ] API response times (target: < 500ms)
- [ ] Database performance (monitor slow queries)
- [ ] API rate limiting working correctly
- [ ] No security warnings or alerts

### User Feedback Collection
- [ ] Invite beta users to test
- [ ] Monitor feedback channels (email, support form)
- [ ] Track conversion rate on pricing page
- [ ] Track signup completion rate
- [ ] Monitor payment success rate

### Rollback Plan (If Critical Issues)
```bash
# If production is broken, immediate rollback:
# 1. Go to Vercel Dashboard
# 2. Navigate to Deployments
# 3. Select the last known good deployment
# 4. Click "Redeploy"

# Expected rollback time: < 2 minutes
```

---

## Post-Launch Maintenance (Week 1)

### Daily Checks
- [ ] Zero critical errors in Sentry
- [ ] API response times stable
- [ ] Database performance acceptable
- [ ] No security incidents
- [ ] User signup flowing normally
- [ ] Payments processing correctly

### Weekly Checks
- [ ] API key expiration dates monitored
- [ ] Database backup integrity verified
- [ ] Security patches available (npm audit)
- [ ] Performance metrics trending correctly
- [ ] User feedback addressed

### Key Metrics to Monitor
```
- Signup conversion rate (target: > 10%)
- Payment success rate (target: > 95%)
- API error rate (target: < 0.1%)
- Page load time (target: < 2s)
- Market feed update latency (target: < 30s)
- AI recommendation generation time (target: < 5s)
```

---

## Production Runbook

### Issue: High API Error Rate
1. Check Sentry dashboard for error patterns
2. Check database connectivity: `SELECT 1;` in SQL editor
3. Check Supabase service status
4. Check API rate limiting (may be too strict)
5. If persistent: rollback to previous deployment

### Issue: Payment Processing Failures
1. Verify Stripe webhook is responding: Stripe Dashboard → Webhooks
2. Check logs for webhook errors
3. Verify webhook secret matches Supabase Vault
4. Test payment flow manually in Stripe test mode
5. Contact Stripe support if payment processing is down

### Issue: Slow API Responses
1. Check database query performance (enable query logging)
2. Check for N+1 queries in API routes
3. Review cache hit rates for secret cache
4. Check external API latency (MarketAux, Groq, etc.)
5. Consider adding Redis caching layer

### Issue: API Keys Compromised
1. Immediately revoke the key in the service provider
2. Update the secret in Supabase Vault with new key
3. Redeploy application: `git push origin main` (triggers Vercel rebuild)
4. Review audit logs for unauthorized access
5. Send security notice to affected users (if applicable)

### Issue: Database Storage Quota Exceeded
1. Check database size: Supabase Dashboard → Database → Usage
2. Identify large tables and old data
3. Archive or delete old data
4. Upgrade Supabase plan if needed
5. Implement data retention policies

---

## Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: support@supabase.io
- **Stripe Support**: https://support.stripe.com/
- **Status Pages**:
  - Vercel: https://vercel.statuspage.io
  - Supabase: https://status.supabase.com
  - Stripe: https://status.stripe.com

---

## Post-Launch Optimization (Week 2+)

### Performance Optimization
- [ ] Implement Redis caching for frequently accessed data
- [ ] Enable CDN for static assets
- [ ] Optimize database indexes
- [ ] Implement API response caching headers
- [ ] Consider edge functions for API response caching

### Feature Releases
- [ ] Plan feature rollout (80/20 split testing)
- [ ] Use feature flags for gradual rollout
- [ ] Monitor metrics for each feature
- [ ] Gather user feedback before full release

### Scaling Preparation
- [ ] Load testing completed (target: 1000 concurrent users)
- [ ] Database connection pooling configured
- [ ] Rate limits adjusted based on usage
- [ ] Monitoring alerts configured for load spikes
- [ ] Horizontal scaling plan documented

---

**Generated**: 2026-03-20
**Status**: Ready for Production Deployment


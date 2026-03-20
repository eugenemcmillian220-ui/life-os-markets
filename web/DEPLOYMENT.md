# Life OS Deployment Guide

Complete guide for deploying Life OS to production.

## Prerequisites

- Vercel account (Frontend)
- Railway account (Backend)
- Supabase account (Database & Auth)
- Stripe account (Payments)
- GitHub repository

## Environment Variables Required

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Market Data APIs (Free)
```
NEXT_PUBLIC_MARKETAUX_API_KEY=your_key
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_key
NEXT_PUBLIC_GDELT_API_KEY=optional
```

### LLM APIs (Free)
```
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_HF_API_KEY=hf_...
NEXT_PUBLIC_GOOGLE_API_KEY=your_key
```

### Stripe
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

```bash
vercel deploy --prod
```

## Backend Deployment (Railway)

Background jobs for market data fetching and recommendations.

```bash
railway link
railway up --detach
```

## Database Setup (Supabase)

Run SQL migrations:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'builder')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  market_linked BOOLEAN DEFAULT FALSE,
  date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Market events
CREATE TABLE market_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('bullish', 'neutral', 'bearish')),
  impact TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Recommendations
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  market_event_id UUID REFERENCES market_events(id),
  title TEXT NOT NULL,
  reason TEXT,
  priority TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Monitoring

- Vercel Analytics
- Railway Logs
- Supabase Metrics
- Stripe Dashboard

## Scaling

- Increase Supabase compute
- Add Railway replicas
- Cache market data with Redis
- CDN for static assets

## Support

Email: support@lifeos.app

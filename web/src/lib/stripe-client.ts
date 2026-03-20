// Stripe billing client for Starter ($4.99/mo) and Builder ($12.99/mo) tiers
export const PRICING_TIERS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 4.99,
    stripePriceId: 'price_starter_monthly',
    features: [
      'Basic task management',
      '100 market alerts/day',
      '1 financial goal',
      'Daily recommendations',
      'Ad-free',
    ],
    limits: {
      marketAlerts: 100,
      recommendations: 2, // per day
      financialGoals: 1,
      apiCalls: 5000, // per month
    },
  },
  builder: {
    id: 'builder',
    name: 'Builder',
    price: 12.99,
    stripePriceId: 'price_builder_monthly',
    features: [
      'Unlimited tasks & habits',
      'Real-time market alerts',
      '10 financial goals',
      'AI recommendations (real-time)',
      'Integrations (Plaid, YNAB)',
      'API access',
    ],
    limits: {
      marketAlerts: Infinity,
      recommendations: Infinity,
      financialGoals: 10,
      apiCalls: Infinity,
    },
  },
}

export async function createCheckoutSession(tier: 'starter' | 'builder', email: string) {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, email }),
    })

    if (!response.ok) throw new Error('Checkout failed')
    return await response.json()
  } catch (error) {
    console.error('Checkout error:', error)
    throw error
  }
}

export async function getUserSubscription(userId: string) {
  try {
    const response = await fetch(`/api/stripe/subscription?userId=${userId}`)
    if (!response.ok) throw new Error('Failed to fetch subscription')
    return await response.json()
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return null
  }
}

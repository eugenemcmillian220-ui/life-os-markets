'use client'

import { Header } from '@/components/layout/header'
import { ArrowRight, Zap, TrendingUp, Brain } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-display text-5xl lg:text-6xl font-bold tracking-tight">
                  Your Life OS
                  <br />
                  <span className="text-accent">Thinks Ahead</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                  Real-time market intelligence integrated with your productivity system. When markets move, your tasks evolve automatically.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-card transition-colors"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Market Heartbeat Animation */}
            {mounted && (
              <div className="relative h-96 hidden lg:block">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {/* Outer pulse */}
                    <div className="absolute inset-0 market-heartbeat bg-accent/10 rounded-full" />
                    
                    {/* Inner content */}
                    <div className="absolute inset-8 bg-card rounded-full border border-border flex flex-col items-center justify-center p-6">
                      <div className="text-center space-y-3">
                        <Brain className="w-12 h-12 text-accent mx-auto" />
                        <h3 className="font-display font-bold text-sm">Market Heartbeat</h3>
                        <div className="text-xs text-muted-foreground">
                          <p>Breaking: Fed Rate +0.25%</p>
                          <p className="text-accent font-semibold">📌 3 tasks updated</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-12 text-center">Why Life OS?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: 'Real-Time Market Feed',
                  desc: 'Live financial news, Fed decisions, ECB announcements. All integrated with your tasks.',
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: 'AI-Powered Suggestions',
                  desc: 'Market events trigger smart task recommendations. Stay ahead of financial opportunities.',
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: 'Financial Intelligence',
                  desc: 'Track cross-border markets (US, EU, Asia). Understand market sentiment impact on your goals.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-border bg-background hover:border-accent transition-colors">
                  <div className="text-accent mb-3">{feature.icon}</div>
                  <h3 className="font-display font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-4 text-center">Simple Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
              No free tier. Real features for real people. Cancel anytime.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {[
                {
                  name: 'Starter',
                  price: '$4.99',
                  desc: 'Try the idea',
                  features: [
                    'Basic task management',
                    '100 market alerts/day',
                    '1 financial goal',
                    'Daily recommendations',
                    'Ad-free',
                  ],
                },
                {
                  name: 'Builder',
                  price: '$12.99',
                  desc: 'Build your system',
                  features: [
                    'Unlimited tasks & habits',
                    'Real-time market alerts',
                    '10 financial goals',
                    'AI recommendations (real-time)',
                    'Integrations (Plaid, YNAB)',
                    'API access',
                  ],
                  highlighted: true,
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-lg border transition-all ${
                    plan.highlighted
                      ? 'border-accent bg-accent/5 shadow-lg'
                      : 'border-border bg-card hover:border-accent'
                  }`}
                >
                  <h3 className="font-display font-bold text-2xl mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="font-display text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-accent mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard"
                    className={`w-full py-2 rounded-lg font-semibold transition-colors text-center block ${
                      plan.highlighted
                        ? 'bg-accent text-accent-foreground hover:opacity-90'
                        : 'border border-border hover:bg-card'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4 bg-card/30">
          <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
            <p>© 2026 Life OS. Real market intelligence. Real productivity.</p>
          </div>
        </footer>
      </main>
    </>
  )
}

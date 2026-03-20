'use client'

import { Header } from '@/components/layout/header'
import { BarChart3, TrendingUp, Zap, Target } from 'lucide-react'

export default function AnalyticsPage() {
  const stats = [
    { label: 'API Calls (This Month)', value: '287', icon: BarChart3, tier: 'Builder' },
    { label: 'Market Alerts', value: '42', icon: TrendingUp, tier: 'Unlimited' },
    { label: 'Recommendations Generated', value: '18', icon: Zap, tier: 'Real-time' },
    { label: 'Tasks Affected by Market', value: '12', icon: Target, tier: 'Tracked' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="font-display text-4xl font-bold mb-8">Analytics & Usage</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="p-6 rounded-lg border border-border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.tier}</p>
                </div>
              )
            })}
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <h2 className="font-display font-bold text-lg mb-4">Usage Breakdown</h2>
            <div className="space-y-4">
              {[
                { name: 'MarketAux API Calls', usage: 87, limit: 100, color: 'bg-accent' },
                { name: 'LLM Requests (Groq)', usage: 156, limit: 1000, color: 'bg-emerald-500' },
                { name: 'Market Alerts', usage: 42, limit: 100, color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.usage} / {item.limit}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className={`${item.color} rounded-full h-2`} style={{ width: `${(item.usage / item.limit) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

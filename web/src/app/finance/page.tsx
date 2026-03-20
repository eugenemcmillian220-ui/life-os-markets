'use client'

import { Header } from '@/components/layout/header'
import { TrendingUp, Wallet, AlertCircle } from 'lucide-react'

export default function FinancePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="font-display text-4xl font-bold mb-8">Financial Overview</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">Financial Goals</h3>
                <Wallet className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Q2 Savings', progress: 65 },
                  { name: 'Portfolio Rebalance', progress: 40 },
                ].map((goal, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold mb-1">{goal.name}</p>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-accent rounded-full h-2"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">Market Impact</h3>
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-emerald-300">✓ EUR/USD rising benefits your EUR goals</p>
                <p className="text-amber-300">⚠ Fed decision may affect USD exposure</p>
                <p className="text-slate-400">→ Next rebalance recommended Friday</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-amber-300">ECB Decision Today</h4>
                <p className="text-sm text-muted-foreground mt-1">Rate announcement at 2pm CET may impact EUR/USD pair and your currency goals.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

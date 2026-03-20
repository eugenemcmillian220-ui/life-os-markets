'use client'

import { Header } from '@/components/layout/header'
import { Plus, Target, TrendingUp } from 'lucide-react'

export default function GoalsPage() {
  const goals = [
    { id: 1, name: 'Save €10k', progress: 65, target: '€10,000', category: 'financial', tags: ['ECB-sensitive'] },
    { id: 2, name: 'Rebalance Portfolio', progress: 40, target: '50% equity', category: 'financial', tags: ['Fed-dependent'] },
    { id: 3, name: 'Learn Forex Trading', progress: 30, target: '100 hours', category: 'personal', tags: [] },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold">Goals</h1>
              <p className="text-muted-foreground mt-2">{goals.length} active goals</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>

          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="p-6 rounded-lg border border-border bg-card hover:border-accent transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg flex items-center gap-2">
                      {goal.category === 'financial' ? '💰' : '🎯'} {goal.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Target: {goal.target}</p>
                  </div>
                  <span className="text-2xl font-bold text-accent">{goal.progress}%</span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                  <div
                    className="bg-accent rounded-full h-2 transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {goal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {goal.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

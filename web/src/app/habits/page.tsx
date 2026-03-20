'use client'

import { Header } from '@/components/layout/header'
import { Plus, Zap } from 'lucide-react'

export default function HabitsPage() {
  const habits = [
    { id: 1, name: 'Exercise', streak: 7, goal: 'Daily', lastDone: '2026-03-19' },
    { id: 2, name: 'Meditation', streak: 14, goal: 'Daily', lastDone: '2026-03-19' },
    { id: 3, name: 'Reading', streak: 3, goal: 'Daily', lastDone: '2026-03-19' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold">Habits</h1>
              <p className="text-muted-foreground mt-2">Track your daily routines</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              Add Habit
            </button>
          </div>

          <div className="space-y-4">
            {habits.map(habit => (
              <div key={habit.id} className="p-6 rounded-lg border border-border bg-card hover:border-accent transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.goal}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold text-sm">{habit.streak}d</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 flex-1 rounded ${
                        i < 3 ? 'bg-emerald-500/50' : 'bg-slate-500/20'
                      }`}
                      title={`Day ${i + 1}`}
                    />
                  ))}
                </div>

                <button className="mt-4 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-card transition-colors w-full">
                  Mark Today
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

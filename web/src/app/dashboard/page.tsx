'use client'

import { Header } from '@/components/layout/header'
import { Zap, TrendingUp, Target, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Your productivity system meets market intelligence</p>
          </div>

          {mounted && (
            <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-amber-500">Market Alert: ECB Decision Today</h3>
                  <p className="text-sm text-muted-foreground mt-1">Central bank rate decision expected at 2pm CET. 3 of your tasks may be affected.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Tasks Today', value: '3', icon: Target },
              { label: 'Habit Streak', value: '7 days', icon: Zap },
              { label: 'Market Alerts', value: '2', icon: TrendingUp },
              { label: 'Financial Goals', value: '5', icon: Wallet },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="p-6 rounded-lg border border-border bg-card hover:border-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <Icon className="w-8 h-8 text-accent opacity-50" />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h2 className="font-display font-bold text-lg mb-4">Live Market Feed</h2>
                <div className="space-y-4">
                  {[
                    { time: '2 mins ago', title: 'US Markets Open Higher', sentiment: 'bullish' },
                    { time: '15 mins ago', title: 'ECB Signals Rate Pause', sentiment: 'neutral' },
                    { time: '1 hour ago', title: 'EUR/USD Drops on Inflation', sentiment: 'bearish' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border hover:border-accent transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          item.sentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-300' :
                          item.sentiment === 'bearish' ? 'bg-red-500/20 text-red-300' :
                          'bg-slate-500/20 text-slate-300'
                        }`}>
                          {item.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card">
                <h2 className="font-display font-bold text-lg mb-4">Today's Tasks</h2>
                <div className="space-y-3">
                  {[
                    { title: 'Review Q2 Budget', done: false, market: true },
                    { title: 'Weekly Planning', done: true, market: false },
                    { title: 'Check EUR/USD Levels', done: false, market: true },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-card/50 transition-colors">
                      <input type="checkbox" defaultChecked={task.done} className="w-4 h-4 rounded cursor-pointer" />
                      <div className="flex-1">
                        <p className={task.done ? 'line-through text-muted-foreground' : 'text-foreground'}>
                          {task.title}
                        </p>
                      </div>
                      {task.market && <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">Market-linked</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-display font-bold mb-4">Habits</h3>
                <div className="space-y-4">
                  {['Exercise', 'Meditation', 'Reading'].map((habit, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{habit}</span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">7d</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-display font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full py-2 px-3 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                    + New Task
                  </button>
                  <button className="w-full py-2 px-3 rounded-lg border border-border text-sm font-semibold hover:bg-card transition-colors">
                    + New Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

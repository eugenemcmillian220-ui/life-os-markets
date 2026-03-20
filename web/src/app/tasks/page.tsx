'use client'

import { Header } from '@/components/layout/header'
import { Plus, Filter, SortAsc, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Q2 Budget', done: false, priority: 'high', market: true, date: '2026-03-20' },
    { id: 2, title: 'Weekly Planning', done: true, priority: 'medium', market: false, date: '2026-03-19' },
    { id: 3, title: 'Check EUR/USD Levels', done: false, priority: 'high', market: true, date: '2026-03-20' },
    { id: 4, title: 'Morning Exercise', done: true, priority: 'medium', market: false, date: '2026-03-19' },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold">Tasks</h1>
              <p className="text-muted-foreground mt-2">{tasks.filter(t => !t.done).length} active tasks</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-card transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-card transition-colors text-sm">
              <SortAsc className="w-4 h-4" />
              Sort
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className="p-4 rounded-lg border border-border bg-card hover:border-accent transition-colors flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded cursor-pointer mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className={task.done ? 'line-through text-muted-foreground' : 'text-foreground font-semibold'}>
                    {task.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                      task.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                    {task.market && (
                      <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">Market-linked</span>
                    )}
                    <span className="text-xs text-muted-foreground">{task.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 hover:bg-background rounded transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

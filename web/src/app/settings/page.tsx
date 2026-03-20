'use client'

import { Header } from '@/components/layout/header'
import { Save, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [riskTolerance, setRiskTolerance] = useState('medium')

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="font-display text-4xl font-bold mb-8">Settings</h1>

          <div className="space-y-6">
            {/* Subscription */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-display font-bold mb-4">Subscription</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Current Plan</span>
                  <span className="font-bold text-accent">Builder ($12.99/mo)</span>
                </div>
                <div className="text-sm text-muted-foreground">Next billing: April 19, 2026</div>
              </div>
            </div>

            {/* Market Preferences */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-display font-bold mb-4">Market Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span>Track US Markets (Fed decisions)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span>Track EU Markets (ECB decisions)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span>Track Cryptocurrency</span>
                </label>
              </div>
            </div>

            {/* Risk Tolerance */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-display font-bold mb-4">Risk Tolerance</h3>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map(level => (
                  <label key={level} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="risk"
                      value={level}
                      checked={riskTolerance === level}
                      onChange={(e) => setRiskTolerance(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-display font-bold mb-4">Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span>Market alerts</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span>Task recommendations</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span>Email digest</span>
                </label>
              </div>
            </div>

            {/* Data & Export */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-display font-bold mb-4">Data & Privacy</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-background transition-colors text-left">
                  📥 Export Data (CSV)
                </button>
                <button className="w-full px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-background transition-colors text-left">
                  🗑️ Delete Account
                </button>
              </div>
            </div>

            {/* Save */}
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

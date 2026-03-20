'use client'

import Link from 'next/link'
import { Menu, Settings } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">🧠</div>
          <span className="hidden sm:inline">Life OS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem href="/dashboard" label="Dashboard" />
          <NavItem href="/tasks" label="Tasks" />
          <NavItem href="/habits" label="Habits" />
          <NavItem href="/goals" label="Goals" />
          <NavItem href="/finance" label="Finance" />
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/settings" className="p-2 hover:bg-card rounded transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
          <button
            className="md:hidden p-2 hover:bg-card rounded transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="flex flex-col p-4 gap-2">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/tasks" label="Tasks" />
            <NavItem href="/habits" label="Habits" />
            <NavItem href="/goals" label="Goals" />
            <NavItem href="/finance" label="Finance" />
            <hr className="my-2 border-border" />
            <NavItem href="/settings" label="Settings" />
          </nav>
        </div>
      )}
    </header>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium hover:text-foreground hover:bg-card rounded transition-colors text-muted-foreground"
    >
      {label}
    </Link>
  )
}

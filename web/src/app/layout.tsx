import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import './globals.css'

const sora = Sora({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Life OS - Market Intelligence Meets Productivity',
  description: 'Real-time market intelligence integrated with your productivity system. Auto-generate actionable task recommendations when markets move.',
  icons: '/favicon.ico',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${dmSans.variable} font-body antialiased bg-background text-foreground`}
      >
        <div className="relative flex flex-col min-h-screen">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  )
}

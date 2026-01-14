import type { Metadata } from 'next'
import './globals.css'
import ThemeWatcher from '@/components/ThemeWatcher'

export const metadata: Metadata = {
  title: 'Portal Wall',
  description: 'Your personal dashboard with multiple windows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeWatcher />
        {children}
      </body>
    </html>
  )
}

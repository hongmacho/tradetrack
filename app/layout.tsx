import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { MobileNav } from '@/components/layout/MobileNav'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TradeTrack',
  description: '현장 기술직 작업 관리',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'TradeTrack' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geist.className} bg-slate-50 antialiased`}>
        <main className="min-h-screen pb-20">{children}</main>
        <MobileNav />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'

export const metadata: Metadata = {
  title: 'OSRS Prices',
  description: 'Check GE prices using the Oldschool Runescape API',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}

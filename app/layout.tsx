import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'OSRS Prices',
  description: 'Check GE prices using the Oldschool Runescape API',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin-ext'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Container>
              <Header />
              <Suspense>{children}</Suspense>
            </Container>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

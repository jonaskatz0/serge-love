import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'serge.love — AI Video Ads Generator',
  description: 'Create stunning AI-powered video ads in minutes. Choose from 1000+ AI actors, 6 AI engines, and generate professional video ads for your brand.',
  keywords: ['AI video', 'video ads', 'AI actors', 'UGC ads', 'video generation'],
  openGraph: {
    title: 'serge.love — AI Video Ads Generator',
    description: 'Create stunning AI-powered video ads in minutes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}

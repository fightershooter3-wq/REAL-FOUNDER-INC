import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MicroFounder AI - Build Your Startup',
    template: '%s | MicroFounder AI',
  },
  description: 'AI-powered startup execution platform for teenagers and early-stage founders to validate, build, and launch real startups.',
  keywords: ['startup', 'founder', 'validation', 'execution', 'AI', 'entrepreneurship'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://microfounder-ai.com',
    siteName: 'MicroFounder AI',
    title: 'MicroFounder AI - Build Your Startup',
    description: 'AI-powered startup execution platform for teenagers and early-stage founders',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MicroFounder AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MicroFounder AI',
    description: 'AI-powered startup execution platform',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { clsx } from 'clsx'

import { Providers } from '@/providers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kreditheld24.de'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={clsx(GeistSans.variable, GeistMono.variable)}
      lang="de"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <Breadcrumb />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: SITE_URL,
    siteName: 'Kreditheld24',
    images: [
      {
        url: `${SITE_URL}/website-template-OG.webp`,
        width: 1200,
        height: 630,
        alt: 'Kreditheld24 - Ihr Kreditvergleich',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kreditheld24',
  },
}

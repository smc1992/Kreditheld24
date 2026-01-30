import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { clsx } from 'clsx'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={clsx(GeistSans.variable, GeistMono.variable)}
      lang="de"
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Kreditheld24',
  description: 'Ihr Kreditvergleich',
}

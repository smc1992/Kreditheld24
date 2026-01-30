import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { clsx } from 'clsx';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '../(frontend)/globals.css';

// Force dynamic rendering for all portal pages
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kreditheld24 Kundenportal',
  description: 'Kundenportal für Kreditanfragen',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}

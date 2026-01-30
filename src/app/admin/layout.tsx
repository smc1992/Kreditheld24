import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { clsx } from 'clsx';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AdminThemeProvider } from '@/providers/AdminThemeProvider';
import '../(frontend)/globals.css';

// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kreditheld24 Admin',
  description: 'CRM Admin Dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AdminThemeProvider>
          {children}
        </AdminThemeProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

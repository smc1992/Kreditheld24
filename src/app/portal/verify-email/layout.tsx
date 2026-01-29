import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { clsx } from 'clsx';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '../../(frontend)/globals.css';

export const metadata: Metadata = {
  title: 'E-Mail verifizieren - Kreditheld24',
  description: 'E-Mail-Adresse verifizieren',
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={clsx(GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

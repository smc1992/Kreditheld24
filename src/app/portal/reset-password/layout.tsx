import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { clsx } from 'clsx';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '../../(frontend)/globals.css';

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen - Kreditheld24',
  description: 'Passwort zurücksetzen',
};

export default function ResetPasswordLayout({
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

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Mail verifizieren - Kreditheld24',
  description: 'E-Mail-Adresse verifizieren',
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

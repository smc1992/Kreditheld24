import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen - Kreditheld24',
  description: 'Passwort zurücksetzen',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

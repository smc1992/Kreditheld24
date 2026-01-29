import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrierung - Kreditheld24',
  description: 'Kundenportal Registrierung',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

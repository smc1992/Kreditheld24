import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Login - Kreditheld24',
  description: 'Kundenportal Login',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

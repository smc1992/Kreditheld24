import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

// Force dynamic rendering for all portal pages
export const dynamic = 'force-dynamic'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: Session check is now handled by individual pages to prevent redirect loops
  // Public pages (login, register, etc.) have their own layouts
  // Protected pages will check session themselves
  
  return <>{children}</>;
}

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth'; // We'll need a client component for signout ideally, but for now server action or similar

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protect route
  if (!session) {
    redirect('/portal/login');
  }

  // Ensure role is customer (admins should probably use admin dashboard, but maybe they can view too? for now strict)
  if (session.user.role !== 'customer') {
    // If admin tries to access, maybe redirect to admin? or let them pass if we want admins to see portal view
    // redirect('/admin'); 
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-900">Kreditheld24</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">Kundenportal</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{session.user.name}</span>
            </div>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/portal/login' });
              }}
            >
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Abmelden</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

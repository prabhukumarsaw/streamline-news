import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/server/auth/config';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';

const allowedRoles = [
  'super_admin',
  'Super Administrator',
  'editor',
  'Editor',
  'author',
  'Author',
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authConfig);
  const user = session?.user as { role?: string } | undefined;

  if (!user || !user.role) redirect('/unauthorized');

  // Immediate redirect for contributors
  if (['contributor', 'Contributor'].includes(user.role)) {
    redirect('/dashboard/userbench');
  }

  if (!allowedRoles.includes(user.role)) redirect('/unauthorized');

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar userRole={user.role} />
      <main className="flex-1">{children}</main>
      <Toaster />
    </SidebarProvider>
  );
}

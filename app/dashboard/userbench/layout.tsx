import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/server/auth/config';
import { redirect } from 'next/navigation';

interface UserbenchLayoutProps {
  children: ReactNode;
}

export default async function UserbenchLayout({
  children,
}: UserbenchLayoutProps) {
  const session = await getServerSession(authConfig);
  const user = session?.user as { role?: string } | undefined;

  if (!user || !user.role) redirect('/unauthorized');
  if (!['contributor', 'Contributor'].includes(user.role)) {
    redirect('/unauthorized');
  }

  return <main className="flex-1 p-4">{children}</main>;
}

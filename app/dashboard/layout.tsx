/**
 * Dashboard Layout
 * Created by:  postgres
 * Description: Protected dashboard layout with role-based navigation and sidebar
 */

import { Metadata } from 'next';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Dashboard | Advanced News Platform',
  description: 'Manage your news platform with comprehensive dashboard tools.',
  robots: 'noindex, nofollow',
});

/**
 * Dashboard layout component
 * Provides protected layout for dashboard pages
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      requireAuth={true}
      requiredPermissions={[{ resource: 'dashboard', action: 'read' }]}
      fallbackUrl="/auth/login"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

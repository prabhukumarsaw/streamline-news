/**
 * Dashboard Page
 * Created by:  postgres
 * Description: Main dashboard page with role-based content rendering
 */

'use client';

import { useAuth } from '@/hooks/use-auth';
import { AdminDashboard } from '@/components/dashboard/admin/admin-dashboard';
import { EditorDashboard } from '@/components/dashboard/editor/editor-dashboard';
import { AuthorDashboard } from '@/components/dashboard/author/author-dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * Main dashboard page component
 * Renders appropriate dashboard based on user role
 */
export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this dashboard.
        </p>
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user.role.name) {
    case 'super_admin':
    case 'admin':
      return <AdminDashboard />;

    case 'editor':
      return <EditorDashboard />;

    case 'author':
      return <AuthorDashboard />;

    default:
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
          <p className="text-muted-foreground">
            Your role ({user.role.displayName}) doesn't have a specific
            dashboard configured.
          </p>
        </div>
      );
  }
}

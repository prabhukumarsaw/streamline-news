/**
 * Protected Route Component
 * Created by:  postgres
 * Description: Route protection with authentication and permission checks
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredPermissions?: Array<{ resource: string; action: string }>;
  requiredRole?: string;
  fallbackUrl?: string;
}

/**
 * Protected route wrapper component
 * Handles authentication and authorization checks
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredPermissions = [],
  requiredRole,
  fallbackUrl = '/auth/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    hasPermission,
    hasRole,
  } = useAuth();
  const { can, isLoading: permissionsLoading } = usePermissions();

  useEffect(() => {
    // Wait for auth state to be determined
    if (authLoading || permissionsLoading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(fallbackUrl);
      return;
    }

    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorizedtest');
      return;
    }

    // Check permission requirements
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(
        ({ resource, action }) => can(action, resource)
      );

      if (!hasAllPermissions) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [
    isAuthenticated,
    authLoading,
    permissionsLoading,
    user,
    requiredPermissions,
    requiredRole,
    router,
    fallbackUrl,
    hasRole,
    can,
  ]);

  // Show loading while checking authentication
  if (authLoading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Don't render if role requirement not met
  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  // Don't render if permission requirements not met
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(
      ({ resource, action }) => can(action, resource)
    );

    if (!hasAllPermissions) {
      return null;
    }
  }

  return <>{children}</>;
}

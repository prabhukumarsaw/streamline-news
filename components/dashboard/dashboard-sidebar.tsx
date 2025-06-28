/**
 * Dashboard Sidebar Component
 * Created by:  postgres
 * Description: Role-based navigation sidebar for dashboard
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  BarChart3,
  Shield,
  MessageSquare,
  Calendar,
  Tag,
  Image,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermissions?: Array<{ resource: string; action: string }>;
  requiredRole?: string;
}

/**
 * Navigation items configuration
 * Defines sidebar navigation with permission requirements
 */
const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Articles',
    href: '/dashboard/articles',
    icon: FileText,
    requiredPermissions: [{ resource: 'articles', action: 'read' }],
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: Users,
    requiredPermissions: [{ resource: 'users', action: 'read' }],
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    requiredPermissions: [{ resource: 'analytics', action: 'read' }],
  },
  {
    name: 'Comments',
    href: '/dashboard/comments',
    icon: MessageSquare,
    requiredPermissions: [{ resource: 'comments', action: 'read' }],
  },
  {
    name: 'Categories',
    href: '/dashboard/categories',
    icon: Tag,
    requiredPermissions: [{ resource: 'categories', action: 'read' }],
  },
  {
    name: 'Media',
    href: '/dashboard/media',
    icon: Image,
    requiredPermissions: [{ resource: 'media', action: 'read' }],
  },
  {
    name: 'Permissions',
    href: '/dashboard/permissions',
    icon: Shield,
    requiredRole: 'admin',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    requiredPermissions: [{ resource: 'settings', action: 'read' }],
  },
];

/**
 * Dashboard sidebar component
 * Provides role-based navigation for dashboard
 */
export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { can, isSectionAllowed } = usePermissions();

  /**
   * Check if user can access navigation item
   * Validates permissions and role requirements
   */
  const canAccessItem = (item: NavigationItem): boolean => {
    // Check role requirement
    if (item.requiredRole && user?.role.name !== item.requiredRole) {
      return false;
    }

    // Check permission requirements
    if (item.requiredPermissions) {
      return item.requiredPermissions.every(({ resource, action }) =>
        can(action, resource)
      );
    }

    return true;
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <span className="font-bold text-xl">NewsHub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            if (!canAccessItem(item)) return null;

            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.role.displayName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

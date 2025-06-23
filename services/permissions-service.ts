/**
 * Permissions Service
 * Created by: Prabhu
 * Description: Handles permission and role management API calls
 */

import { Permission, UserRole, DashboardAccess } from '@/types/auth';

// Mock permissions data
const mockPermissions: Permission[] = [
  { id: '1', name: 'manage_users', resource: 'users', action: 'manage' },
  { id: '2', name: 'create_articles', resource: 'articles', action: 'create' },
  { id: '3', name: 'edit_articles', resource: 'articles', action: 'update' },
  { id: '4', name: 'delete_articles', resource: 'articles', action: 'delete' },
  { id: '5', name: 'publish_articles', resource: 'articles', action: 'publish' },
  { id: '6', name: 'view_analytics', resource: 'analytics', action: 'read' },
  { id: '7', name: 'manage_settings', resource: 'settings', action: 'manage' },
];

const mockRoles: UserRole[] = [
  {
    id: 'super_admin',
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Complete system access',
    level: 100,
    permissions: mockPermissions,
  },
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Administrative access',
    level: 80,
    permissions: mockPermissions.slice(0, 6),
  },
  {
    id: 'editor',
    name: 'editor',
    displayName: 'Editor',
    description: 'Content management',
    level: 50,
    permissions: mockPermissions.slice(1, 5),
  },
  {
    id: 'author',
    name: 'author',
    displayName: 'Author',
    description: 'Content creation',
    level: 25,
    permissions: mockPermissions.slice(1, 3),
  },
];

/**
 * Permissions service class
 * Handles permission and role operations
 */
class PermissionsService {
  private baseURL = '/api/permissions';

  /**
   * Get user permissions
   * Fetches permissions for specific user
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock permission fetch based on user role
      // In real app, this would be an API call
      return mockPermissions.slice(0, 4); // Mock user permissions
    } catch (error) {
      throw new Error('Failed to fetch user permissions');
    }
  }

  /**
   * Get all available roles
   * Fetches role definitions
   */
  async getAllRoles(): Promise<UserRole[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockRoles;
    } catch (error) {
      throw new Error('Failed to fetch roles');
    }
  }

  /**
   * Check dashboard access
   * Determines dashboard access permissions
   */
  async checkDashboardAccess(userId: string): Promise<DashboardAccess> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock dashboard access check
      return {
        canAccess: true,
        allowedSections: [
          'dashboard',
          'articles',
          'analytics',
          'settings',
        ],
        restrictions: [],
      };
    } catch (error) {
      throw new Error('Failed to check dashboard access');
    }
  }

  /**
   * Update user role
   * Changes user role and permissions
   */
  async updateUserRole(userId: string, roleId: string): Promise<UserRole> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const role = mockRoles.find(r => r.id === roleId);
      if (!role) {
        throw new Error('Role not found');
      }
      
      return role;
    } catch (error) {
      throw new Error('Failed to update user role');
    }
  }

  /**
   * Grant permission to user
   * Adds specific permission to user
   */
  async grantPermission(userId: string, permissionId: string): Promise<Permission> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const permission = mockPermissions.find(p => p.id === permissionId);
      if (!permission) {
        throw new Error('Permission not found');
      }
      
      return permission;
    } catch (error) {
      throw new Error('Failed to grant permission');
    }
  }

  /**
   * Revoke permission from user
   * Removes specific permission from user
   */
  async revokePermission(userId: string, permissionId: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock permission revocation
      return;
    } catch (error) {
      throw new Error('Failed to revoke permission');
    }
  }

  /**
   * Check if user has permission
   * Validates specific permission for user
   */
  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const userPermissions = await this.getUserPermissions(userId);
      return userPermissions.some(p => p.resource === resource && p.action === action);
    } catch (error) {
      throw new Error('Failed to check permission');
    }
  }
}

// Export singleton instance
export const permissionsService = new PermissionsService();
/**
 * Permissions Hook
 * Created by:  postgres
 * Description: Custom hook for permission management and access control
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { fetchUserPermissions, checkDashboardAccess } from '@/store/slices/permissionsSlice';
import { ROLES } from './use-auth';

/**
 * Permission type for clarity
 */
export interface Permission {
  action: string;
  resource: string;
}

/**
 * Dashboard section type
 */
export type DashboardSection = string;

/**
 * Custom hook for advanced permissions management and access control
 * Integrates with Redux and centralized role constants
 */
export const usePermissions = () => {
  const dispatch = useAppDispatch();
  const permissionsState = useAppSelector((state) => state.permissions);
  const authState = useAppSelector((state) => state.auth);

  /**
   * Fetch user permissions from backend/store
   */
  const fetchPermissions = useCallback(async (userId: string) => {
    return dispatch(fetchUserPermissions(userId));
  }, [dispatch]);

  /**
   * Check dashboard access for a user
   */
  const checkAccess = useCallback(async (userId: string) => {
    return dispatch(checkDashboardAccess(userId));
  }, [dispatch]);

  /**
   * Check if user can perform an action on a resource
   */
  const can = useCallback((action: string, resource: string): boolean => {
    if (!authState.user) return false;
    return permissionsState.permissions.some(
      (permission: Permission) => permission.action === action && permission.resource === resource
    );
  }, [authState.user, permissionsState.permissions]);

  /**
   * Inverse of can
   */
  const cannot = useCallback((action: string, resource: string): boolean => {
    return !can(action, resource);
  }, [can]);

  /**
   * Get all allowed dashboard sections for the user
   */
  const getAllowedSections = useCallback((): DashboardSection[] => {
    return permissionsState.dashboardAccess.allowedSections || [];
  }, [permissionsState.dashboardAccess]);

  /**
   * Check if a specific dashboard section is allowed
   */
  const isSectionAllowed = useCallback((section: DashboardSection): boolean => {
    return (permissionsState.dashboardAccess.allowedSections || []).includes(section);
  }, [permissionsState.dashboardAccess]);

  /**
   * Get the user's role level (for hierarchy)
   */
  const getRoleLevel = useCallback((): number => {
    // Use the user's role name for comparison
    const roleName = authState.user?.role?.name;
    switch (roleName) {
      case ROLES.SUPER_ADMIN:
      case ROLES.SUPER_ADMIN_ALT:
        return 3;
      case ROLES.EDITOR:
      case ROLES.EDITOR_ALT:
        return 2;
      case ROLES.AUTHOR:
      case ROLES.AUTHOR_ALT:
        return 1;
      case ROLES.CONTRIBUTOR:
      case ROLES.CONTRIBUTOR_ALT:
        return 0;
      default:
        return 0;
    }
  }, [authState.user]);

  /**
   * Check if user has at least a minimum role level
   */
  const hasMinimumRoleLevel = useCallback((minLevel: number): boolean => {
    return getRoleLevel() >= minLevel;
  }, [getRoleLevel]);

  /**
   * Check if user has any of the given permissions
   */
  const hasAnyPermission = useCallback((permissionList: Permission[]): boolean => {
    return permissionList.some(({ action, resource }) => can(action, resource));
  }, [can]);

  /**
   * Check if user has all of the given permissions
   */
  const hasAllPermissions = useCallback((permissionList: Permission[]): boolean => {
    return permissionList.every(({ action, resource }) => can(action, resource));
  }, [can]);

  return {
    // State
    permissions: permissionsState.permissions,
    dashboardAccess: permissionsState.dashboardAccess,
    isLoading: permissionsState.isLoading,
    error: permissionsState.error,

    // Actions
    fetchPermissions,
    checkAccess,

    // Permission utilities
    can,
    cannot,
    hasAnyPermission,
    hasAllPermissions,

    // Dashboard section utilities
    getAllowedSections,
    isSectionAllowed,

    // Role level utilities
    getRoleLevel,
    hasMinimumRoleLevel,
  };
};
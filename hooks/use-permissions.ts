/**
 * Permissions Hook
 * Created by: Prabhu
 * Description: Custom hook for permission management and access control
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { fetchUserPermissions, checkDashboardAccess } from '@/store/slices/permissionsSlice';

/**
 * Custom hook for permissions management
 * Provides permission state and utilities
 */
export const usePermissions = () => {
  const dispatch = useAppDispatch();
  const permissionsState = useAppSelector((state) => state.permissions);
  const authState = useAppSelector((state) => state.auth);

  /**
   * Fetch user permissions
   * Loads permissions for current user
   */
  const fetchPermissions = useCallback(async (userId: string) => {
    return dispatch(fetchUserPermissions(userId));
  }, [dispatch]);

  /**
   * Check dashboard access
   * Verifies dashboard access permissions
   */
  const checkAccess = useCallback(async (userId: string) => {
    return dispatch(checkDashboardAccess(userId));
  }, [dispatch]);

  /**
   * Check if user can perform action on resource
   * Granular permission checking
   */
  const can = useCallback((action: string, resource: string) => {
    if (!authState.user) return false;
    
    return permissionsState.permissions.some(permission => 
      permission.action === action && permission.resource === resource
    );
  }, [authState.user, permissionsState.permissions]);

  /**
   * Check if user cannot perform action on resource
   * Inverse permission checking
   */
  const cannot = useCallback((action: string, resource: string) => {
    return !can(action, resource);
  }, [can]);

  /**
   * Get allowed dashboard sections
   * Returns list of accessible dashboard sections
   */
  const getAllowedSections = useCallback(() => {
    return permissionsState.dashboardAccess.allowedSections;
  }, [permissionsState.dashboardAccess]);

  /**
   * Check if section is allowed
   * Verifies access to specific dashboard section
   */
  const isSectionAllowed = useCallback((section: string) => {
    return permissionsState.dashboardAccess.allowedSections.includes(section);
  }, [permissionsState.dashboardAccess]);

  /**
   * Get user role level
   * Returns numeric role level for comparison
   */
  const getRoleLevel = useCallback(() => {
    return authState.user?.role.level || 0;
  }, [authState.user]);

  /**
   * Check if user has minimum role level
   * Role hierarchy checking
   */
  const hasMinimumRoleLevel = useCallback((minLevel: number) => {
    return getRoleLevel() >= minLevel;
  }, [getRoleLevel]);

  return {
    // State
    permissions: permissionsState.permissions,
    dashboardAccess: permissionsState.dashboardAccess,
    isLoading: permissionsState.isLoading,
    error: permissionsState.error,
    
    // Actions
    fetchPermissions,
    checkAccess,
    
    // Utilities
    can,
    cannot,
    getAllowedSections,
    isSectionAllowed,
    getRoleLevel,
    hasMinimumRoleLevel,
  };
};
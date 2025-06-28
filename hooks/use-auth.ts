/**
 * Authentication Hook
 * Created by:  postgres
 * Description: Custom hook for authentication state and actions
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { loginUser, logoutUser, registerUser, fetchCurrentUser, clearError } from '@/store/slices/authSlice';
import { LoginCredentials, RegisterData } from '@/types/auth';

/**
 * Custom hook for authentication
 * Provides authentication state and actions
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  /**
   * Login user with credentials
   * Handles user authentication
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials));
  }, [dispatch]);

  /**
   * Register new user
   * Handles user registration
   */
  const register = useCallback(async (userData: RegisterData) => {
    return dispatch(registerUser(userData));
  }, [dispatch]);

  /**
   * Logout current user
   * Clears user session
   */
  const logout = useCallback(async () => {
    return dispatch(logoutUser());
  }, [dispatch]);

  /**
   * Fetch current user profile
   * Loads user data
   */
  const getCurrentUser = useCallback(async () => {
    return dispatch(fetchCurrentUser());
  }, [dispatch]);

  /**
   * Clear authentication error
   * Resets error state
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Check if user has specific permission
   * Permission-based access control
   */
  const hasPermission = useCallback((resource: string, action: string) => {
    if (!authState.user) return false;
    
    return authState.permissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  }, [authState.user, authState.permissions]);

  /**
   * Check if user has specific role
   * Role-based access control
   */
  const hasRole = useCallback((roleName: string) => {
    if (!authState.user) return false;
    return authState.user.role.name === roleName;
  }, [authState.user]);

  /**
   * Check if user can access dashboard
   * Dashboard access control
   */
  const canAccessDashboard = useCallback(() => {
    return hasRole('admin') || hasRole('editor') || hasRole('author');
  }, [hasRole]);

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    permissions: authState.permissions,
    
    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    clearAuthError,
    
    // Utilities
    hasPermission,
    hasRole,
    canAccessDashboard,
  };
};
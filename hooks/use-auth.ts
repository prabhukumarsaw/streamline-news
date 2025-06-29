/**
 * Authentication Hook
 * Created by:  postgres
 * Description: Custom hook for authentication state and actions
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import authService, { RegisterData, LoginData, AuthResponse } from '@/services/auth-service';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  role: string | null;
  permissions: any;
}

export interface AuthActions {
  register: (data: RegisterData) => Promise<AuthResponse>;
  login: (data: LoginData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, password: string) => Promise<AuthResponse>;
  setupMFA: () => Promise<AuthResponse>;
  verifyMFA: (code: string) => Promise<AuthResponse>;
  disableMFA: (password: string) => Promise<AuthResponse>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

// Centralized role constants
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  SUPER_ADMIN_ALT: 'Super Administrator',
  EDITOR: 'editor',
  EDITOR_ALT: 'Editor',
  AUTHOR: 'author',
  AUTHOR_ALT: 'Author',
  CONTRIBUTOR: 'contributor',
  CONTRIBUTOR_ALT: 'Contributor',
};

export type Role = keyof typeof ROLES | string;

// Utility to check if a role matches any in a list
export function hasRole(userRole: string | null | undefined, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function useAuth(): AuthState & AuthActions & {
  hasRole: (allowedRoles: string[]) => boolean;
} {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const user = session?.user || null;
  const role = (user as any)?.role || null;
  const permissions = (user as any)?.permissions || {};

  // Registration with automatic redirect
  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.register(data);
      if (result.success) {
        // Redirect to verification page after successful registration
        router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Login with automatic redirect
  const login = useCallback(async (data: LoginData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.login(data);
      if (result.success) {
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Logout with automatic redirect
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Email verification with automatic redirect
  const verifyEmail = useCallback(async (token: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.verifyEmail(token);
      if (result.success) {
        // Redirect to login after successful verification
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Resend verification email
  const resendVerification = useCallback(async (email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      return await authService.resendVerification(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      return await authService.forgotPassword(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset password with automatic redirect
  const resetPassword = useCallback(async (token: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.resetPassword(token, password);
      if (result.success) {
        // Redirect to login after successful password reset
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // MFA setup
  const setupMFA = useCallback(async (): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      return await authService.setupMFA();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // MFA verification
  const verifyMFA = useCallback(async (code: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      return await authService.verifyMFA(code);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // MFA disable
  const disableMFA = useCallback(async (password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      return await authService.disableMFA(password);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Permission checks
  const hasPermission = useCallback((permission: string): boolean => {
    return permissions[permission] === true;
  }, [permissions]);

  const hasAnyPermission = useCallback((permissionList: string[]): boolean => {
    return permissionList.some(permission => permissions[permission] === true);
  }, [permissions]);

  const hasAllPermissions = useCallback((permissionList: string[]): boolean => {
    return permissionList.every(permission => permissions[permission] === true);
  }, [permissions]);

  // Role check
  const hasRoleFn = useCallback((allowedRoles: string[]): boolean => {
    return hasRole(role, allowedRoles);
  }, [role]);

  return {
    // State
    isAuthenticated,
    isLoading: isLoading || status === 'loading',
    user,
    role,
    permissions,
    
    // Actions
    register,
    login,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    setupMFA,
    verifyMFA,
    disableMFA,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole: hasRoleFn,
  };
}

// Hook for protecting routes (auth only)
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

// Hook for role-based access control (multiple roles)
export function useRequireRoles(allowedRoles: string[], redirectTo: string = '/dashboard') {
  const { role, isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole(allowedRoles)) {
      router.push(redirectTo);
    }
  }, [role, isAuthenticated, isLoading, router, allowedRoles, hasRole, redirectTo]);

  return { role, isAuthenticated, isLoading };
}

// Hook for permission-based access control (multiple permissions)
export function useRequirePermissions(requiredPermissions: string[], redirectTo: string = '/dashboard') {
  const { hasAllPermissions, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasAllPermissions(requiredPermissions)) {
      router.push(redirectTo);
    }
  }, [hasAllPermissions, isAuthenticated, isLoading, router, requiredPermissions, redirectTo]);

  return { hasPermissions: hasAllPermissions(requiredPermissions), isAuthenticated, isLoading };
}
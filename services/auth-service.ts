/**
 * Enhanced Authentication Service
 * Created by:  postgres
 * Description: Production-ready authentication service with Laravel backend
 */

//  postgres: This service now uses Next.js server actions and Drizzle ORM. Legacy Laravel API logic removed.

// Example: import your server action
// import { loginAction } from '@/actions/auth/login';

// Example login wrapper (uncomment and use if needed)
// export async function login(credentials: { email: string; password: string }) {
//   return await loginAction(credentials);
// }

// LocalStorage helpers (client-side only)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('userDetails');
  return userData ? JSON.parse(userData) : null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
  };
}

import { signIn, signOut, getSession } from 'next-auth/react';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

class AuthService {
  // Registration
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed',
        error: 'Network error occurred',
      };
    }
  }

  // Email verification
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Email verification failed',
        error: 'Network error occurred',
      };
    }
  }

  // Resend verification email
  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to resend verification email',
        error: 'Network error occurred',
      };
    }
  }

  // Login with NextAuth
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        mfaCode: data.mfaCode,
        redirect: false,
      });

      if (result?.error) {
        return {
          success: false,
          message: result.error,
        };
      }

      return {
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        error: 'Authentication error occurred',
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    await signOut({ redirect: false });
  }

  // Get current session
  async getCurrentSession() {
    return await getSession();
  }

  // Forgot password
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send password reset email',
        error: 'Network error occurred',
      };
    }
  }

  // Reset password
  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Password reset failed',
        error: 'Network error occurred',
      };
    }
  }

  // MFA setup
  async setupMFA(): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'MFA setup failed',
        error: 'Network error occurred',
      };
    }
  }

  // MFA verification
  async verifyMFA(code: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'MFA verification failed',
        error: 'Network error occurred',
      };
    }
  }

  // MFA disable
  async disableMFA(password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/mfa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'MFA disable failed',
        error: 'Network error occurred',
      };
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }

  // Get user role
  async getUserRole(): Promise<string | null> {
    const session = await this.getCurrentSession();
    return (session?.user as any)?.role || null;
  }

  // Get user permissions
  async getUserPermissions(): Promise<any> {
    const session = await this.getCurrentSession();
    return (session?.user as any)?.permissions || {};
  }

  // Check if user has specific permission
  async hasPermission(permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions();
    return permissions[permission] === true;
  }

  // Check if user has any of the specified permissions
  async hasAnyPermission(permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions();
    return permissions.some(permission => userPermissions[permission] === true);
  }

  // Check if user has all of the specified permissions
  async hasAllPermissions(permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions();
    return permissions.every(permission => userPermissions[permission] === true);
  }
}

export const authService = new AuthService();
export default authService;
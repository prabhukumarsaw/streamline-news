/**
 * Authentication Service
 * Created by: Prabhu
 * Description: Handles all authentication-related API calls with backend integration
 */

import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';
import { apiClient } from '@/lib/api-client';

/**
 * Authentication service class
 * Handles all authentication operations with Laravel backend
 */
class AuthService {
  /**
   * Login user with credentials
   * Authenticates user and returns tokens
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.status && response.data) {
        const { user, token } = response.data;
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(user));
        }

        return {
          user: this.transformUser(user),
          token,
          refreshToken: token, // Laravel Sanctum uses same token
          expiresIn: 3600,
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Register new user
   * Creates new user account
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
      });

      if (response.status && response.data) {
        const { user, token } = response.data;
        
        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(user));
        }

        return {
          user: this.transformUser(user),
          token,
          refreshToken: token,
          expiresIn: 3600,
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Logout user
   * Invalidates user session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear stored tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    }
  }

  /**
   * Get current user profile
   * Fetches user data from token
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/user');
      
      if (response.status && response.data) {
        return this.transformUser(response.data);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error: any) {
      // Try to get user from localStorage as fallback
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          return this.transformUser(JSON.parse(storedUser));
        }
      }
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Transform backend user data to frontend format
   */
  private transformUser(backendUser: any): User {
    return {
      id: backendUser.id?.toString() || '1',
      email: backendUser.email || '',
      name: backendUser.name || '',
      avatar: backendUser.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      role: {
        id: backendUser.role?.id || 'user',
        name: (backendUser.role?.name || 'author') as any,
        displayName: backendUser.role?.display_name || 'Author',
        description: backendUser.role?.description || 'Content creator',
        level: backendUser.role?.level || 25,
        permissions: this.transformPermissions(backendUser.permissions || []),
      },
      permissions: this.transformPermissions(backendUser.permissions || []),
      isActive: backendUser.is_active !== false,
      createdAt: backendUser.created_at || new Date().toISOString(),
      updatedAt: backendUser.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Transform backend permissions to frontend format
   */
  private transformPermissions(backendPermissions: any[]): any[] {
    return backendPermissions.map(permission => ({
      id: permission.id?.toString() || Math.random().toString(),
      name: permission.name || 'default_permission',
      resource: permission.resource || 'general',
      action: permission.action || 'read',
    }));
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }
}

// Export singleton instance
export const authService = new AuthService();
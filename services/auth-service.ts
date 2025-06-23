/**
 * Authentication Service
 * Created by: Prabhu
 * Description: Handles all authentication-related API calls and token management
 */

import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';

// Mock data for demonstration - replace with actual API calls
const mockUsers = [
  {
    id: '1',
    email: 'admin@newsplatform.com',
    name: 'Admin User',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: {
      id: 'admin',
      name: 'admin' as const,
      displayName: 'Administrator',
      description: 'Full system access',
      level: 100,
      permissions: [
        { id: '1', name: 'manage_users', resource: 'users', action: 'manage' as const },
        { id: '2', name: 'manage_articles', resource: 'articles', action: 'manage' as const },
        { id: '3', name: 'view_analytics', resource: 'analytics', action: 'read' as const },
      ],
    },
    permissions: [
      { id: '1', name: 'manage_users', resource: 'users', action: 'manage' as const },
      { id: '2', name: 'manage_articles', resource: 'articles', action: 'manage' as const },
      { id: '3', name: 'view_analytics', resource: 'analytics', action: 'read' as const },
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'editor@newsplatform.com',
    name: 'Editor User',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: {
      id: 'editor',
      name: 'editor' as const,
      displayName: 'Editor',
      description: 'Content management access',
      level: 50,
      permissions: [
        { id: '4', name: 'edit_articles', resource: 'articles', action: 'update' as const },
        { id: '5', name: 'publish_articles', resource: 'articles', action: 'publish' as const },
      ],
    },
    permissions: [
      { id: '4', name: 'edit_articles', resource: 'articles', action: 'update' as const },
      { id: '5', name: 'publish_articles', resource: 'articles', action: 'publish' as const },
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * Authentication service class
 * Handles all authentication operations
 */
class AuthService {
  private baseURL = '/api/auth';

  /**
   * Login user with credentials
   * Authenticates user and returns tokens
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with actual API call
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Mock password validation (in real app, this is done server-side)
      if (credentials.password !== 'password123') {
        throw new Error('Invalid credentials');
      }
      
      const token = this.generateMockToken();
      const refreshToken = this.generateMockToken();
      
      return {
        user,
        token,
        refreshToken,
        expiresIn: 3600, // 1 hour
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  /**
   * Register new user
   * Creates new user account
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: {
          id: 'author',
          name: 'author',
          displayName: 'Author',
          description: 'Content creation access',
          level: 25,
          permissions: [
            { id: '6', name: 'create_articles', resource: 'articles', action: 'create' },
          ],
        },
        permissions: [
          { id: '6', name: 'create_articles', resource: 'articles', action: 'create' },
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const token = this.generateMockToken();
      const refreshToken = this.generateMockToken();
      
      return {
        user: newUser,
        token,
        refreshToken,
        expiresIn: 3600,
      };
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  /**
   * Logout user
   * Invalidates user session
   */
  async logout(): Promise<void> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, invalidate token on server
      return;
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  /**
   * Refresh authentication token
   * Extends user session
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock token refresh - replace with actual API call
      const user = mockUsers[0]; // Mock current user
      const newToken = this.generateMockToken();
      const newRefreshToken = this.generateMockToken();
      
      return {
        user,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      };
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Get current user profile
   * Fetches user data from token
   */
  async getCurrentUser(): Promise<User> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user fetch - replace with actual API call
      const token = this.getStoredToken();
      if (!token) {
        throw new Error('No token found');
      }
      
      // In real app, decode token or make API call
      return mockUsers[0];
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Update user profile
   * Updates user information
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock profile update
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      Object.assign(user, updates);
      return user;
    } catch (error) {
      throw new Error('Profile update failed');
    }
  }

  /**
   * Change user password
   * Updates user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock password change
      if (currentPassword !== 'password123') {
        throw new Error('Current password is incorrect');
      }
      
      // In real app, update password on server
      return;
    } catch (error) {
      throw new Error('Password change failed');
    }
  }

  /**
   * Get stored authentication token
   * Retrieves token from localStorage
   */
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Generate mock JWT token
   * Creates fake token for demonstration
   */
  private generateMockToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const authService = new AuthService();
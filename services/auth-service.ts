/**
 * Enhanced Authentication Service
 * Created by: Prabhu
 * Description: Production-ready authentication service with Laravel backend
 */

import { apiClient } from '@/lib/api-client';
import { ApiList } from '@/lib/api-config';

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

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(ApiList.apiLogin, credentials);
      
      if (response.status && response.data) {
        // Store token and user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userDetails', JSON.stringify(response.data.user));
        }
        
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(ApiList.apiLogout);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
      }
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await apiClient.get('/user');
      return response;
    } catch (error) {
      // Fallback to stored user data
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('userDetails');
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      }
      throw error;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  getUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('userDetails');
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
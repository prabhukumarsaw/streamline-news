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

export const authService = {
  isAuthenticated,
  getToken,
  getUser,
};
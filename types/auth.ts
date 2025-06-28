/**
 * Authentication and Authorization Types
 * Created by:  postgres
 * Description: Comprehensive type definitions for user authentication, roles, and permissions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  phone?: string;
  address?: string;
  department?: string;
  position?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserRole {
  id: string;
  name: RoleName;
  displayName: string;
  description: string;
  level: number; // Higher number = more privileges
  permissions: Permission[];
}

export type RoleName = 'super_admin' | 'admin' | 'editor' | 'author' | 'contributor' | 'subscriber';

export interface Permission {
  id: string;
  name: string;
  resource: string; // e.g., 'articles', 'users', 'dashboard'
  action: PermissionAction; // e.g., 'create', 'read', 'update', 'delete'
  conditions?: PermissionCondition[]; // Additional conditions for permission
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'publish' | 'moderate' | 'manage';

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in';
  value: any;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  permissions: Permission[];
  roles: UserRole[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: RoleName;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface DashboardAccess {
  canAccess: boolean;
  allowedSections: string[];
  restrictions: string[];
}

// Dashboard specific types for different roles
export interface AdminDashboardData {
  totalUsers: number;
  totalArticles: number;
  totalViews: number;
  recentActivity: ActivityLog[];
  systemHealth: SystemHealth;
}

export interface EditorDashboardData {
  assignedArticles: number;
  pendingReviews: number;
  publishedToday: number;
  draftArticles: number;
}

export interface AuthorDashboardData {
  myArticles: number;
  totalViews: number;
  averageRating: number;
  recentComments: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
}

//  postgres: Types for authentication and user
export type AuthUser = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  permissions: string[];
  avatar_url?: string;
};

export type LoginResponse = {
  success: boolean;
  data?: {
    user: AuthUser;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  message: string;
};
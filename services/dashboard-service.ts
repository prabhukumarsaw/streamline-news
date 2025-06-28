/**
 * Dashboard Service
 * Created by:  postgres
 * Description: Handles dashboard data and analytics API calls
 */

import { AdminDashboardData, EditorDashboardData, AuthorDashboardData, ActivityLog } from '@/types/auth';

/**
 * Dashboard service class
 * Handles dashboard data operations
 */
class DashboardService {
  private baseURL = '/api/dashboard';

  /**
   * Get admin dashboard data
   * Fetches comprehensive admin metrics
   */
  async getAdminDashboard(dateRange: { startDate: string; endDate: string }): Promise<AdminDashboardData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock admin dashboard data
      return {
        totalUsers: 1247,
        totalArticles: 3456,
        totalViews: 125847,
        recentActivity: [
          {
            id: '1',
            userId: '1',
            userName: 'John Doe',
            action: 'Published article',
            resource: 'articles',
            timestamp: new Date().toISOString(),
            details: { articleTitle: 'Breaking News Update' },
          },
          {
            id: '2',
            userId: '2',
            userName: 'Jane Smith',
            action: 'Updated user profile',
            resource: 'users',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        systemHealth: {
          status: 'healthy',
          uptime: 99.9,
          memoryUsage: 65,
          cpuUsage: 45,
          diskUsage: 78,
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch admin dashboard data');
    }
  }

  /**
   * Get editor dashboard data
   * Fetches editor-specific metrics
   */
  async getEditorDashboard(dateRange: { startDate: string; endDate: string }): Promise<EditorDashboardData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock editor dashboard data
      return {
        assignedArticles: 23,
        pendingReviews: 8,
        publishedToday: 5,
        draftArticles: 12,
      };
    } catch (error) {
      throw new Error('Failed to fetch editor dashboard data');
    }
  }

  /**
   * Get author dashboard data
   * Fetches author-specific metrics
   */
  async getAuthorDashboard(dateRange: { startDate: string; endDate: string }): Promise<AuthorDashboardData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock author dashboard data
      return {
        myArticles: 15,
        totalViews: 8547,
        averageRating: 4.2,
        recentComments: 34,
      };
    } catch (error) {
      throw new Error('Failed to fetch author dashboard data');
    }
  }

  /**
   * Get activity logs
   * Fetches system activity logs
   */
  async getActivityLogs(params: { page: number; limit: number; userId?: string }): Promise<ActivityLog[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock activity logs
      const logs: ActivityLog[] = [];
      for (let i = 0; i < params.limit; i++) {
        logs.push({
          id: `log_${i + 1}`,
          userId: `user_${Math.floor(Math.random() * 10) + 1}`,
          userName: `User ${Math.floor(Math.random() * 10) + 1}`,
          action: ['Created', 'Updated', 'Deleted', 'Published'][Math.floor(Math.random() * 4)],
          resource: ['articles', 'users', 'comments', 'settings'][Math.floor(Math.random() * 4)],
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        });
      }
      
      return logs;
    } catch (error) {
      throw new Error('Failed to fetch activity logs');
    }
  }

  /**
   * Generate dashboard report
   * Creates downloadable dashboard report
   */
  async generateReport(type: 'admin' | 'editor' | 'author', dateRange: { startDate: string; endDate: string }): Promise<Blob> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock report generation
      const reportData = `Dashboard Report - ${type}\nDate Range: ${dateRange.startDate} to ${dateRange.endDate}\n\nGenerated on: ${new Date().toISOString()}`;
      return new Blob([reportData], { type: 'text/plain' });
    } catch (error) {
      throw new Error('Failed to generate report');
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
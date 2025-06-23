/**
 * Dashboard Redux Slice
 * Created by: Prabhu
 * Description: Manages dashboard data, analytics, and role-specific dashboard states
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminDashboardData, EditorDashboardData, AuthorDashboardData, ActivityLog } from '@/types/auth';
import { dashboardService } from '@/services/dashboard-service';

interface DashboardState {
  adminData: AdminDashboardData | null;
  editorData: EditorDashboardData | null;
  authorData: AuthorDashboardData | null;
  activityLogs: ActivityLog[];
  selectedDateRange: {
    startDate: string;
    endDate: string;
  };
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial dashboard state
 * Default values for all dashboard types
 */
const initialState: DashboardState = {
  adminData: null,
  editorData: null,
  authorData: null,
  activityLogs: [],
  selectedDateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    endDate: new Date().toISOString(),
  },
  isLoading: false,
  error: null,
};

/**
 * Async thunk for fetching admin dashboard data
 * Loads comprehensive admin analytics and metrics
 */
export const fetchAdminDashboard = createAsyncThunk(
  'dashboard/fetchAdminDashboard',
  async (dateRange: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getAdminDashboard(dateRange);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch admin dashboard');
    }
  }
);

/**
 * Async thunk for fetching editor dashboard data
 * Loads editor-specific metrics and assigned content
 */
export const fetchEditorDashboard = createAsyncThunk(
  'dashboard/fetchEditorDashboard',
  async (dateRange: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getEditorDashboard(dateRange);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch editor dashboard');
    }
  }
);

/**
 * Async thunk for fetching author dashboard data
 * Loads author-specific content metrics and performance
 */
export const fetchAuthorDashboard = createAsyncThunk(
  'dashboard/fetchAuthorDashboard',
  async (dateRange: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getAuthorDashboard(dateRange);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch author dashboard');
    }
  }
);

/**
 * Async thunk for fetching activity logs
 * Loads system activity and user actions
 */
export const fetchActivityLogs = createAsyncThunk(
  'dashboard/fetchActivityLogs',
  async (params: { page: number; limit: number; userId?: string }, { rejectWithValue }) => {
    try {
      const logs = await dashboardService.getActivityLogs(params);
      return logs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch activity logs');
    }
  }
);

/**
 * Dashboard slice with reducers and actions
 * Manages all dashboard-related state changes
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    /**
     * Clear dashboard error
     * Resets error state after user acknowledgment
     */
    clearDashboardError: (state) => {
      state.error = null;
    },
    
    /**
     * Set dashboard loading state
     * Manual control over loading state
     */
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    /**
     * Update date range for dashboard data
     * Triggers data refresh with new date range
     */
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.selectedDateRange = action.payload;
    },
    
    /**
     * Add new activity log
     * Used for real-time activity updates
     */
    addActivityLog: (state, action: PayloadAction<ActivityLog>) => {
      state.activityLogs.unshift(action.payload);
      // Keep only latest 100 logs in memory
      if (state.activityLogs.length > 100) {
        state.activityLogs = state.activityLogs.slice(0, 100);
      }
    },
    
    /**
     * Reset dashboard data
     * Used on logout or role changes
     */
    resetDashboard: (state) => {
      state.adminData = null;
      state.editorData = null;
      state.authorData = null;
      state.activityLogs = [];
      state.error = null;
    },
    
    /**
     * Update admin dashboard metrics
     * Used for real-time metric updates
     */
    updateAdminMetrics: (state, action: PayloadAction<Partial<AdminDashboardData>>) => {
      if (state.adminData) {
        state.adminData = { ...state.adminData, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch admin dashboard cases
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action: PayloadAction<AdminDashboardData>) => {
        state.isLoading = false;
        state.adminData = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch editor dashboard cases
    builder
      .addCase(fetchEditorDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEditorDashboard.fulfilled, (state, action: PayloadAction<EditorDashboardData>) => {
        state.isLoading = false;
        state.editorData = action.payload;
        state.error = null;
      })
      .addCase(fetchEditorDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch author dashboard cases
    builder
      .addCase(fetchAuthorDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuthorDashboard.fulfilled, (state, action: PayloadAction<AuthorDashboardData>) => {
        state.isLoading = false;
        state.authorData = action.payload;
        state.error = null;
      })
      .addCase(fetchAuthorDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch activity logs cases
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action: PayloadAction<ActivityLog[]>) => {
        state.isLoading = false;
        state.activityLogs = action.payload;
        state.error = null;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions for use in components
export const {
  clearDashboardError,
  setDashboardLoading,
  setDateRange,
  addActivityLog,
  resetDashboard,
  updateAdminMetrics,
} = dashboardSlice.actions;

// Export reducer for store configuration
export default dashboardSlice.reducer;
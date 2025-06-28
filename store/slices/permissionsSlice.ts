/**
 * Permissions Redux Slice
 * Created by:  postgres
 * Description: Manages user permissions, roles, and access control throughout the application
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Permission, UserRole, DashboardAccess } from '@/types/auth';
import { permissionsService } from '@/services/permissions-service';

interface PermissionsState {
  permissions: Permission[];
  roles: UserRole[];
  dashboardAccess: DashboardAccess;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial permissions state
 * Default values for permission management
 */
const initialState: PermissionsState = {
  permissions: [],
  roles: [],
  dashboardAccess: {
    canAccess: false,
    allowedSections: [],
    restrictions: [],
  },
  isLoading: false,
  error: null,
};

/**
 * Async thunk for fetching user permissions
 * Loads all permissions for the current user
 */
export const fetchUserPermissions = createAsyncThunk(
  'permissions/fetchUserPermissions',
  async (userId: string, { rejectWithValue }) => {
    try {
      const permissions = await permissionsService.getUserPermissions(userId);
      return permissions;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch permissions');
    }
  }
);

/**
 * Async thunk for fetching all available roles
 * Loads role definitions for permission management
 */
export const fetchRoles = createAsyncThunk(
  'permissions/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const roles = await permissionsService.getAllRoles();
      return roles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch roles');
    }
  }
);

/**
 * Async thunk for checking dashboard access
 * Determines what dashboard sections user can access
 */
export const checkDashboardAccess = createAsyncThunk(
  'permissions/checkDashboardAccess',
  async (userId: string, { rejectWithValue }) => {
    try {
      const access = await permissionsService.checkDashboardAccess(userId);
      return access;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check dashboard access');
    }
  }
);

/**
 * Permissions slice with reducers and actions
 * Manages all permission-related state changes
 */
const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    /**
     * Clear permissions error
     * Resets error state after user acknowledgment
     */
    clearPermissionsError: (state) => {
      state.error = null;
    },
    
    /**
     * Set permissions loading state
     * Manual control over loading state
     */
    setPermissionsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    /**
     * Update single permission
     * Used for real-time permission updates
     */
    updatePermission: (state, action: PayloadAction<Permission>) => {
      const index = state.permissions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.permissions[index] = action.payload;
      } else {
        state.permissions.push(action.payload);
      }
    },
    
    /**
     * Remove permission
     * Used when permissions are revoked
     */
    removePermission: (state, action: PayloadAction<string>) => {
      state.permissions = state.permissions.filter(p => p.id !== action.payload);
    },
    
    /**
     * Reset permissions state
     * Used on logout or role changes
     */
    resetPermissions: (state) => {
      state.permissions = [];
      state.roles = [];
      state.dashboardAccess = {
        canAccess: false,
        allowedSections: [],
        restrictions: [],
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user permissions cases
    builder
      .addCase(fetchUserPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action: PayloadAction<Permission[]>) => {
        state.isLoading = false;
        state.permissions = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch roles cases
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<UserRole[]>) => {
        state.isLoading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check dashboard access cases
    builder
      .addCase(checkDashboardAccess.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkDashboardAccess.fulfilled, (state, action: PayloadAction<DashboardAccess>) => {
        state.isLoading = false;
        state.dashboardAccess = action.payload;
        state.error = null;
      })
      .addCase(checkDashboardAccess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions for use in components
export const {
  clearPermissionsError,
  setPermissionsLoading,
  updatePermission,
  removePermission,
  resetPermissions,
} = permissionsSlice.actions;

// Export reducer for store configuration
export default permissionsSlice.reducer;
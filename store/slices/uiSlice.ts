/**
 * UI Redux Slice
 * Created by:  postgres
 * Description: Manages global UI state including theme, sidebar, modals, and notifications
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  notifications: Notification[];
  loading: {
    global: boolean;
    components: Record<string, boolean>;
  };
  breadcrumbs: BreadcrumbItem[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

interface NotificationAction {
  label: string;
  action: string;
  variant?: 'primary' | 'secondary';
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

/**
 * Initial UI state
 * Default values for UI components
 */
const initialState: UIState = {
  theme: 'system',
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeModal: null,
  notifications: [],
  loading: {
    global: false,
    components: {},
  },
  breadcrumbs: [],
};

/**
 * UI slice with reducers and actions
 * Manages all UI-related state changes
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Set application theme
     * Updates theme preference and applies changes
     */
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    
    /**
     * Toggle sidebar visibility
     * Opens/closes the main navigation sidebar
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    /**
     * Set sidebar open state
     * Directly controls sidebar visibility
     */
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    /**
     * Toggle sidebar collapsed state
     * Minimizes/expands sidebar while keeping it visible
     */
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    /**
     * Set active modal
     * Controls which modal is currently displayed
     */
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
    
    /**
     * Add notification
     * Adds new notification to the notification center
     */
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
      
      // Keep only latest 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    
    /**
     * Mark notification as read
     * Updates notification read status
     */
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    
    /**
     * Mark all notifications as read
     * Bulk update for all notifications
     */
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    
    /**
     * Remove notification
     * Removes notification from the list
     */
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    /**
     * Clear all notifications
     * Removes all notifications from the list
     */
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    /**
     * Set global loading state
     * Controls application-wide loading indicator
     */
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    
    /**
     * Set component loading state
     * Controls loading state for specific components
     */
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      state.loading.components[action.payload.component] = action.payload.loading;
    },
    
    /**
     * Clear component loading state
     * Removes loading state for specific component
     */
    clearComponentLoading: (state, action: PayloadAction<string>) => {
      delete state.loading.components[action.payload];
    },
    
    /**
     * Set breadcrumbs
     * Updates navigation breadcrumb trail
     */
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
    
    /**
     * Add breadcrumb
     * Adds single breadcrumb to the trail
     */
    addBreadcrumb: (state, action: PayloadAction<BreadcrumbItem>) => {
      // Mark previous breadcrumbs as inactive
      state.breadcrumbs.forEach(item => {
        item.active = false;
      });
      
      // Add new breadcrumb as active
      state.breadcrumbs.push({ ...action.payload, active: true });
    },
    
    /**
     * Reset UI state
     * Resets UI to initial state (used on logout)
     */
    resetUI: (state) => {
      state.activeModal = null;
      state.notifications = [];
      state.loading = {
        global: false,
        components: {},
      };
      state.breadcrumbs = [];
    },
  },
});

// Export actions for use in components
export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setActiveModal,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setComponentLoading,
  clearComponentLoading,
  setBreadcrumbs,
  addBreadcrumb,
  resetUI,
} = uiSlice.actions;

// Export reducer for store configuration
export default uiSlice.reducer;
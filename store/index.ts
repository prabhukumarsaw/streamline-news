/**
 * Redux Store Configuration
 * Created by:  postgres
 * Description: Main store configuration with Redux Toolkit, persistence, and middleware setup
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import all reducers
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import newsReducer from './slices/newsSlice';
import dashboardReducer from './slices/dashboardSlice';
import permissionsReducer from './slices/permissionsSlice';

/**
 * Root reducer combining all feature reducers
 * Each slice manages its own state domain
 */
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  news: newsReducer,
  dashboard: dashboardReducer,
  permissions: permissionsReducer,
});

/**
 * Redux Persist Configuration
 * Persists auth and ui state to localStorage
 */
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
  blacklist: ['news', 'dashboard'], // Don't persist dynamic data
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Store factory function for Next.js SSR compatibility
 * Creates a new store instance for each request
 */
export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore redux-persist actions
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

/**
 * Store instance for client-side usage
 */
export const store = makeStore();

/**
 * Persistor for redux-persist
 */
export const persistor = persistStore(store);

/**
 * Type definitions for TypeScript support
 */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
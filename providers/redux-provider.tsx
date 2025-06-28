/**
 * Redux Provider Component
 * Created by:  postgres
 * Description: Redux store provider with persistence and SSR support
 */

'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Redux provider component
 * Provides Redux store with persistence to the application
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent SSR hydration mismatch
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}

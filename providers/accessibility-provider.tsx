'use client';

import { useEffect } from 'react';
import { axeAccessibilityReporter } from '@axe-core/react';

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      axeAccessibilityReporter(React, ReactDOM, 1000);
    }
  }, []);

  useEffect(() => {
    // Import focus-visible for better focus management
    import('focus-visible');
  }, []);

  return <>{children}</>;
}
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { ReduxProvider } from '@/providers/redux-provider';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReduxProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

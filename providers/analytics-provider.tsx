'use client';

import { createContext, useContext, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useRouter } from 'next/router';

interface AnalyticsContextType {
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  trackPageView: (path: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

  useEffect(() => {
    if (GA4_ID) {
      ReactGA.initialize(GA4_ID, {
        debug: process.env.NODE_ENV === 'development',
      });
    }
  }, [GA4_ID]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (GA4_ID) {
        ReactGA.send({ hitType: 'pageview', page: url });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, GA4_ID]);

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (GA4_ID) {
      ReactGA.event(eventName, parameters);
    }
  };

  const trackPageView = (path: string) => {
    if (GA4_ID) {
      ReactGA.send({ hitType: 'pageview', page: path });
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
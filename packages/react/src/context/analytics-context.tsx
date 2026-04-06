'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface AnalyticsContextValue {
  /** Google Analytics measurement ID */
  googleId: string | null;
  /** Meta/Facebook Pixel ID */
  metaPixelId: string | null;
  /** TikTok Pixel ID */
  tiktokPixelId: string | null;
  /** API base for server-side tracking */
  apiBase: string;
  /** Whether analytics scripts have loaded */
  ready: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AnalyticsContextValue;
}) {
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext(): AnalyticsContextValue | null {
  return useContext(AnalyticsContext);
}

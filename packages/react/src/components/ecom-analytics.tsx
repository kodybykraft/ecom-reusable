'use client';

import { useEffect, useState, useRef } from 'react';
import { AnalyticsProvider } from '../context/analytics-context.js';
import type { ReactNode } from 'react';

interface EcomAnalyticsProps {
  /** API base path. Defaults to '/api/ecom' */
  apiBase?: string;
  children?: ReactNode;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    ttq?: { load: (id: string) => void; page: () => void; track: (event: string, params?: Record<string, unknown>) => void };
  }
}

/**
 * Drop-in analytics component. Loads GA4, Meta Pixel, and TikTok Pixel
 * scripts based on the server-side analytics config.
 *
 * Usage:
 * ```tsx
 * <EcomAnalytics />
 * ```
 *
 * Place in your root layout. Renders nothing visible.
 */
export function EcomAnalytics({ apiBase = '/api/ecom', children }: EcomAnalyticsProps) {
  const [config, setConfig] = useState<{
    google?: { measurementId: string };
    meta?: { pixelId: string };
    tiktok?: { pixelId: string };
  } | null>(null);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  // Fetch analytics config from server
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetch(`${apiBase}/analytics/config`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setConfig(data);
      })
      .catch(() => {
        // Silently fail — analytics should never break the app
      });
  }, [apiBase]);

  // Load scripts when config arrives
  useEffect(() => {
    if (!config) return;

    const promises: Promise<void>[] = [];

    if (config.google?.measurementId) {
      promises.push(loadGA4(config.google.measurementId));
    }

    if (config.meta?.pixelId) {
      promises.push(loadMetaPixel(config.meta.pixelId));
    }

    if (config.tiktok?.pixelId) {
      promises.push(loadTikTokPixel(config.tiktok.pixelId));
    }

    Promise.allSettled(promises).then(() => setReady(true));
  }, [config]);

  // Fire page view on load
  useEffect(() => {
    if (!ready || !config) return;

    if (config.google && window.gtag) {
      window.gtag('event', 'page_view');
    }
    if (config.meta && window.fbq) {
      window.fbq('track', 'PageView');
    }
    if (config.tiktok && window.ttq) {
      window.ttq.page();
    }
  }, [ready, config]);

  return (
    <AnalyticsProvider
      value={{
        googleId: config?.google?.measurementId ?? null,
        metaPixelId: config?.meta?.pixelId ?? null,
        tiktokPixelId: config?.tiktok?.pixelId ?? null,
        apiBase,
        ready,
      }}
    >
      {children ?? null}
    </AnalyticsProvider>
  );
}

// ---------------------------------------------------------------------------
// Script loaders
// ---------------------------------------------------------------------------

function loadGA4(measurementId: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.gtag) { resolve(); return; }

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer!.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId, { send_page_view: false });
      resolve();
    };
    script.onerror = () => resolve(); // fail silently
    document.head.appendChild(script);
  });
}

function loadMetaPixel(pixelId: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.fbq) { resolve(); return; }

    /* eslint-disable */
    const n: any = (window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    /* eslint-enable */

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.async = true;
    script.onload = () => {
      window.fbq!('init', pixelId);
      resolve();
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

function loadTikTokPixel(pixelId: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.ttq) { resolve(); return; }

    const script = document.createElement('script');
    script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    script.async = true;
    script.onload = () => {
      if (window.ttq) {
        window.ttq.load(pixelId);
        resolve();
      } else {
        resolve();
      }
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

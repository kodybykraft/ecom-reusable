'use client';

import { useCallback } from 'react';
import { useAnalyticsContext } from '../context/analytics-context.js';

interface TrackEventData {
  productId?: string;
  productName?: string;
  variantId?: string;
  quantity?: number;
  price?: number;
  currency?: string;
  cartId?: string;
  orderId?: string;
  orderTotal?: number;
  [key: string]: unknown;
}

/**
 * Hook for tracking analytics events across all configured platforms.
 *
 * Usage:
 * ```tsx
 * const { track, productViewed, addToCart } = useAnalytics();
 * ```
 */
export function useAnalytics() {
  const ctx = useAnalyticsContext();

  const track = useCallback(
    (eventName: string, data: TrackEventData = {}) => {
      if (!ctx?.ready) return;

      // GA4
      if (ctx.googleId && window.gtag) {
        const ga4 = mapToGA4(eventName, data);
        if (ga4) window.gtag('event', ga4.name, ga4.params);
      }

      // Meta Pixel
      if (ctx.metaPixelId && window.fbq) {
        const meta = mapToMeta(eventName, data);
        if (meta) window.fbq('track', meta.name, meta.params);
      }

      // TikTok Pixel
      if (ctx.tiktokPixelId && window.ttq) {
        const tt = mapToTikTok(eventName, data);
        if (tt) window.ttq.track(tt.name, tt.params);
      }

      // Server-side internal tracking (fire and forget)
      fetch(`${ctx.apiBase}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, properties: data, pageUrl: window.location.href }),
        keepalive: true,
      }).catch(() => {});
    },
    [ctx],
  );

  const productViewed = useCallback(
    (productId: string, props?: TrackEventData) => {
      track('product_viewed', { productId, ...props });
    },
    [track],
  );

  const addToCart = useCallback(
    (variantId: string, quantity: number, props?: TrackEventData) => {
      track('add_to_cart', { variantId, quantity, ...props });
    },
    [track],
  );

  const checkoutStarted = useCallback(
    (cartId: string, props?: TrackEventData) => {
      track('checkout_started', { cartId, ...props });
    },
    [track],
  );

  const orderCompleted = useCallback(
    (orderId: string, total: number, props?: TrackEventData) => {
      track('order_completed', { orderId, orderTotal: total, ...props });
    },
    [track],
  );

  return { track, productViewed, addToCart, checkoutStarted, orderCompleted };
}

// ---------------------------------------------------------------------------
// Inline mappers (lightweight client-side versions)
// ---------------------------------------------------------------------------

function mapToGA4(event: string, data: TrackEventData) {
  const cents = (v?: number) => (v ?? 0) / 100;
  switch (event) {
    case 'page_view': return { name: 'page_view', params: {} };
    case 'product_viewed': return { name: 'view_item', params: { currency: data.currency ?? 'USD', value: cents(data.price), items: [{ item_id: data.productId, item_name: data.productName }] } };
    case 'add_to_cart': return { name: 'add_to_cart', params: { currency: data.currency ?? 'USD', value: cents(data.price), items: [{ item_id: data.variantId, quantity: data.quantity }] } };
    case 'checkout_started': return { name: 'begin_checkout', params: { currency: data.currency ?? 'USD', value: cents(data.orderTotal) } };
    case 'order_completed': return { name: 'purchase', params: { transaction_id: data.orderId, currency: data.currency ?? 'USD', value: cents(data.orderTotal) } };
    default: return null;
  }
}

function mapToMeta(event: string, data: TrackEventData) {
  const cents = (v?: number) => (v ?? 0) / 100;
  switch (event) {
    case 'page_view': return { name: 'PageView', params: {} };
    case 'product_viewed': return { name: 'ViewContent', params: { content_ids: [data.productId], content_type: 'product', value: cents(data.price), currency: data.currency ?? 'USD' } };
    case 'add_to_cart': return { name: 'AddToCart', params: { content_ids: [data.variantId], content_type: 'product', value: cents(data.price), currency: data.currency ?? 'USD' } };
    case 'checkout_started': return { name: 'InitiateCheckout', params: { value: cents(data.orderTotal), currency: data.currency ?? 'USD' } };
    case 'order_completed': return { name: 'Purchase', params: { value: cents(data.orderTotal), currency: data.currency ?? 'USD' } };
    default: return null;
  }
}

function mapToTikTok(event: string, data: TrackEventData) {
  const cents = (v?: number) => (v ?? 0) / 100;
  switch (event) {
    case 'page_view': return { name: 'Pageview', params: {} };
    case 'product_viewed': return { name: 'ViewContent', params: { content_id: data.productId, value: cents(data.price), currency: data.currency ?? 'USD' } };
    case 'add_to_cart': return { name: 'AddToCart', params: { content_id: data.variantId, value: cents(data.price), currency: data.currency ?? 'USD' } };
    case 'checkout_started': return { name: 'InitiateCheckout', params: { value: cents(data.orderTotal), currency: data.currency ?? 'USD' } };
    case 'order_completed': return { name: 'CompletePayment', params: { value: cents(data.orderTotal), currency: data.currency ?? 'USD' } };
    default: return null;
  }
}

/**
 * Lightweight client-side analytics tracker.
 * Designed to be ~2KB when bundled.
 * Use in browser/React to send events to the server collector endpoint.
 */
export interface ClientTrackerConfig {
  endpoint: string; // e.g. '/api/ecom/analytics/track'
  visitorIdKey?: string;
}

export class ClientTracker {
  private visitorId: string;
  private sessionId: string | null = null;
  private endpoint: string;

  constructor(config: ClientTrackerConfig) {
    this.endpoint = config.endpoint;
    const key = config.visitorIdKey ?? 'ecom_vid';

    // Get or create visitor ID
    if (typeof window !== 'undefined') {
      this.visitorId = localStorage.getItem(key) ?? this.generateId();
      localStorage.setItem(key, this.visitorId);
    } else {
      this.visitorId = this.generateId();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  setSessionId(id: string): void {
    this.sessionId = id;
  }

  async track(eventName: string, properties?: Record<string, unknown>): Promise<void> {
    const payload = {
      eventName,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      properties,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(this.endpoint, JSON.stringify(payload));
      } else {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    } catch {
      // Silently fail — analytics should never break the user experience
    }
  }

  pageView(properties?: Record<string, unknown>): void {
    this.track('page_view', properties);
  }

  productViewed(productId: string, properties?: Record<string, unknown>): void {
    this.track('product_viewed', { productId, ...properties });
  }

  addToCart(variantId: string, quantity: number, properties?: Record<string, unknown>): void {
    this.track('add_to_cart', { variantId, quantity, ...properties });
  }

  checkoutStarted(cartId: string, properties?: Record<string, unknown>): void {
    this.track('checkout_started', { cartId, ...properties });
  }

  orderCompleted(orderId: string, total: number, properties?: Record<string, unknown>): void {
    this.track('order_completed', { orderId, total, ...properties });
  }
}

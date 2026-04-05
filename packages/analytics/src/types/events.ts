export type AnalyticsEventName =
  | 'page_view'
  | 'product_viewed'
  | 'product_list_viewed'
  | 'search_performed'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'checkout_started'
  | 'checkout_step_completed'
  | 'payment_submitted'
  | 'order_completed'
  | 'account_created'
  | 'account_login';

export interface AnalyticsEvent {
  eventName: AnalyticsEventName | string;
  sessionId: string;
  visitorId: string;
  customerId?: string;
  properties?: Record<string, unknown>;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp?: Date;
}

export interface TrackInput {
  eventName: AnalyticsEventName | string;
  properties?: Record<string, unknown>;
  pageUrl?: string;
}

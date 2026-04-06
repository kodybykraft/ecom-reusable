export interface EcomEventData {
  productId?: string;
  productName?: string;
  variantId?: string;
  quantity?: number;
  price?: number; // cents
  currency?: string;
  cartId?: string;
  orderId?: string;
  orderTotal?: number; // cents
  items?: Array<{ id: string; name: string; price: number; quantity: number }>;
}

// GA4 event mapping
export function toGA4Event(eventName: string, data: EcomEventData) {
  switch (eventName) {
    case 'page_view':
      return { name: 'page_view', params: {} };
    case 'product_viewed':
      return {
        name: 'view_item',
        params: {
          currency: data.currency ?? 'USD',
          value: (data.price ?? 0) / 100,
          items: [{ item_id: data.productId, item_name: data.productName, price: (data.price ?? 0) / 100 }],
        },
      };
    case 'add_to_cart':
      return {
        name: 'add_to_cart',
        params: {
          currency: data.currency ?? 'USD',
          value: (data.price ?? 0) / 100,
          items: [{ item_id: data.variantId, quantity: data.quantity ?? 1, price: (data.price ?? 0) / 100 }],
        },
      };
    case 'checkout_started':
      return {
        name: 'begin_checkout',
        params: {
          currency: data.currency ?? 'USD',
          value: (data.orderTotal ?? 0) / 100,
        },
      };
    case 'order_completed':
      return {
        name: 'purchase',
        params: {
          transaction_id: data.orderId,
          currency: data.currency ?? 'USD',
          value: (data.orderTotal ?? 0) / 100,
          items: (data.items ?? []).map((i) => ({
            item_id: i.id,
            item_name: i.name,
            price: i.price / 100,
            quantity: i.quantity,
          })),
        },
      };
    default:
      return { name: eventName, params: data };
  }
}

// Meta/Facebook Pixel event mapping
export function toMetaEvent(eventName: string, data: EcomEventData) {
  switch (eventName) {
    case 'page_view':
      return { name: 'PageView', params: {} };
    case 'product_viewed':
      return {
        name: 'ViewContent',
        params: {
          content_ids: [data.productId],
          content_type: 'product',
          value: (data.price ?? 0) / 100,
          currency: data.currency ?? 'USD',
        },
      };
    case 'add_to_cart':
      return {
        name: 'AddToCart',
        params: {
          content_ids: [data.variantId],
          content_type: 'product',
          value: (data.price ?? 0) / 100,
          currency: data.currency ?? 'USD',
        },
      };
    case 'checkout_started':
      return {
        name: 'InitiateCheckout',
        params: {
          value: (data.orderTotal ?? 0) / 100,
          currency: data.currency ?? 'USD',
        },
      };
    case 'order_completed':
      return {
        name: 'Purchase',
        params: {
          value: (data.orderTotal ?? 0) / 100,
          currency: data.currency ?? 'USD',
          content_ids: (data.items ?? []).map((i) => i.id),
          content_type: 'product',
        },
      };
    default:
      return null;
  }
}

// TikTok Pixel event mapping
export function toTikTokEvent(eventName: string, data: EcomEventData) {
  switch (eventName) {
    case 'page_view':
      return { name: 'Pageview', params: {} };
    case 'product_viewed':
      return {
        name: 'ViewContent',
        params: {
          content_id: data.productId,
          content_type: 'product',
          value: (data.price ?? 0) / 100,
          currency: data.currency ?? 'USD',
        },
      };
    case 'add_to_cart':
      return {
        name: 'AddToCart',
        params: {
          content_id: data.variantId,
          content_type: 'product',
          value: (data.price ?? 0) / 100,
          currency: data.currency ?? 'USD',
          quantity: data.quantity ?? 1,
        },
      };
    case 'checkout_started':
      return {
        name: 'InitiateCheckout',
        params: {
          value: (data.orderTotal ?? 0) / 100,
          currency: data.currency ?? 'USD',
        },
      };
    case 'order_completed':
      return {
        name: 'CompletePayment',
        params: {
          value: (data.orderTotal ?? 0) / 100,
          currency: data.currency ?? 'USD',
          content_type: 'product',
        },
      };
    default:
      return null;
  }
}

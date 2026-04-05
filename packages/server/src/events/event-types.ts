export type DomainEvent =
  | { type: 'product.created'; payload: { productId: string } }
  | { type: 'product.updated'; payload: { productId: string } }
  | { type: 'product.deleted'; payload: { productId: string } }
  | { type: 'cart.created'; payload: { cartId: string } }
  | { type: 'cart.updated'; payload: { cartId: string } }
  | { type: 'cart.item_added'; payload: { cartId: string; variantId: string } }
  | { type: 'cart.item_removed'; payload: { cartId: string; variantId: string } }
  | { type: 'checkout.created'; payload: { checkoutId: string; cartId: string } }
  | { type: 'checkout.updated'; payload: { checkoutId: string } }
  | { type: 'checkout.completed'; payload: { checkoutId: string; orderId: string } }
  | { type: 'order.created'; payload: { orderId: string; customerId?: string } }
  | { type: 'order.paid'; payload: { orderId: string } }
  | { type: 'order.fulfilled'; payload: { orderId: string } }
  | { type: 'order.cancelled'; payload: { orderId: string } }
  | { type: 'order.refunded'; payload: { orderId: string; amount: number } }
  | { type: 'customer.created'; payload: { customerId: string } }
  | { type: 'customer.updated'; payload: { customerId: string } }
  | { type: 'inventory.low_stock'; payload: { variantId: string; quantity: number } }
  | { type: 'discount.created'; payload: { discountId: string } }
  | { type: 'discount.used'; payload: { discountId: string; orderId: string } };

export type EventType = DomainEvent['type'];
export type EventPayload<T extends EventType> = Extract<DomainEvent, { type: T }>['payload'];

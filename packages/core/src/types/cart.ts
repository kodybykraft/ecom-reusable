import type { Money, Currency } from './common.js';
import type { ProductVariant } from './product.js';

export interface Cart {
  id: string;
  customerId: string | null;
  email: string | null;
  currency: Currency;
  status: 'active' | 'converted' | 'abandoned';
  metadata: Record<string, unknown> | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  metadata: Record<string, unknown> | null;
  variant?: ProductVariant;
}

export interface CartTotals {
  subtotal: Money;
  discountTotal: Money;
  taxTotal: Money;
  shippingTotal: Money;
  total: Money;
  itemCount: number;
}

export interface AddToCartInput {
  variantId: string;
  quantity: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateCartItemInput {
  itemId: string;
  quantity: number;
}

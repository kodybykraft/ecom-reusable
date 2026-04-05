import type { Money, CheckoutStatus } from './common.js';
import type { CustomerAddress } from './customer.js';

export interface Checkout {
  id: string;
  cartId: string;
  customerId: string | null;
  email: string;
  shippingAddress: CustomerAddress | null;
  billingAddress: CustomerAddress | null;
  shippingMethodId: string | null;
  subtotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
  discountTotal: Money;
  total: Money;
  status: CheckoutStatus;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCheckoutInput {
  cartId: string;
  email: string;
  customerId?: string;
}

export interface UpdateCheckoutInput {
  shippingAddress?: CustomerAddress;
  billingAddress?: CustomerAddress;
  shippingMethodId?: string;
  email?: string;
}

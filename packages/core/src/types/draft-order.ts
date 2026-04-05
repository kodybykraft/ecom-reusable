import type { Money } from './common.js';

export type DraftOrderStatus = 'open' | 'invoice_sent' | 'completed';

export interface DraftOrder {
  id: string;
  customerId: string | null;
  email: string | null;
  shippingAddress: Record<string, unknown> | null;
  billingAddress: Record<string, unknown> | null;
  subtotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
  discountTotal: Money;
  total: Money;
  discountCode: string | null;
  notes: string | null;
  status: DraftOrderStatus;
  completedOrderId: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  lineItems?: DraftOrderLineItem[];
}

export interface DraftOrderLineItem {
  id: string;
  draftOrderId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  sku: string | null;
  quantity: number;
  price: Money;
  discount: Record<string, unknown> | null;
}

export interface CreateDraftOrderInput {
  email?: string;
  customerId?: string;
  notes?: string;
}

export interface AddDraftLineItemInput {
  variantId: string;
  title: string;
  variantTitle: string;
  sku?: string;
  quantity: number;
  price: Money;
}

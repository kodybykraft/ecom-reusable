import type { Money } from './common.js';

export type ReturnStatus = 'requested' | 'approved' | 'received' | 'refunded' | 'restocked' | 'rejected';
export type ReturnItemCondition = 'new' | 'opened' | 'damaged';
export type RefundMethod = 'original_payment' | 'store_credit';

export interface Return {
  id: string;
  orderId: string;
  customerId: string | null;
  status: ReturnStatus;
  totalRefund: Money;
  refundMethod: RefundMethod;
  trackingNumber: string | null;
  notes: string | null;
  processedBy: string | null;
  requestedAt: Date;
  approvedAt: Date | null;
  receivedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  lineItems?: ReturnLineItem[];
}

export interface ReturnLineItem {
  id: string;
  returnId: string;
  orderLineItemId: string;
  quantity: number;
  reasonId: string;
  condition: ReturnItemCondition;
  note: string | null;
  restock: boolean;
}

export interface ReturnReason {
  id: string;
  label: string;
  description: string | null;
  requiresNote: boolean;
  isActive: boolean;
  position: number;
}

export interface CreateReturnInput {
  orderId: string;
  customerId?: string;
  items: Array<{
    orderLineItemId: string;
    quantity: number;
    reasonId: string;
    condition?: ReturnItemCondition;
    note?: string;
    restock?: boolean;
  }>;
  notes?: string;
}

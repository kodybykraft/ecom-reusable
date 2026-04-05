import type { Money, DiscountType } from './common.js';

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  value: number; // percentage (0-100) or fixed amount in cents
  minPurchaseAmount: Money | null;
  minQuantity: number | null;
  usageLimit: number | null;
  usageCount: number;
  appliesTo: DiscountAppliesTo;
  startsAt: Date;
  endsAt: Date | null;
  isActive: boolean;
  createdAt: Date;
}

export interface DiscountAppliesTo {
  type: 'all' | 'products' | 'collections';
  productIds?: string[];
  collectionIds?: string[];
}

export interface DiscountUsage {
  id: string;
  discountId: string;
  orderId: string;
  customerId: string | null;
  createdAt: Date;
}

export interface CreateDiscountInput {
  code: string;
  type: DiscountType;
  value: number;
  minPurchaseAmount?: Money;
  minQuantity?: number;
  usageLimit?: number;
  appliesTo?: DiscountAppliesTo;
  startsAt?: Date;
  endsAt?: Date;
  isActive?: boolean;
}

export interface DiscountValidationResult {
  valid: boolean;
  reason?: string;
  discountAmount: Money;
}

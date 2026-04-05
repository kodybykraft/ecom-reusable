/** All money values are stored as integer cents to avoid floating-point issues */
export type Money = number & { __brand?: 'Money' };

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortInput {
  field: string;
  direction: SortDirection;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type ProductStatus = 'draft' | 'active' | 'archived';
export type OrderFinancialStatus = 'pending' | 'paid' | 'partially_refunded' | 'refunded';
export type OrderFulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled';
export type CheckoutStatus = 'pending' | 'processing' | 'completed' | 'abandoned';
export type TransactionKind = 'sale' | 'refund' | 'capture' | 'void';
export type TransactionStatus = 'success' | 'failure' | 'pending';
export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';
export type ShippingRateType = 'flat' | 'weight_based' | 'price_based';
export type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';
export type Currency = string; // ISO 4217, e.g. 'USD'

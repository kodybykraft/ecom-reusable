import type { Money } from './common.js';

export type AdjustmentReason = 'received' | 'returned' | 'damaged' | 'correction' | 'transfer_in' | 'transfer_out';
export type AdjustmentReferenceType = 'order' | 'return' | 'transfer' | 'manual';

export interface InventoryLocation {
  id: string;
  name: string;
  address: Record<string, unknown> | null;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
}

export interface InventoryLevel {
  id: string;
  locationId: string;
  variantId: string;
  available: number;
  committed: number;
  incoming: number;
  updatedAt: Date;
}

export interface InventoryAdjustment {
  id: string;
  locationId: string;
  variantId: string;
  quantityChange: number;
  reason: AdjustmentReason;
  referenceType: AdjustmentReferenceType;
  referenceId: string | null;
  note: string | null;
  userId: string | null;
  createdAt: Date;
}

export interface CreateLocationInput {
  name: string;
  address?: Record<string, unknown>;
  isDefault?: boolean;
}

export interface AdjustInventoryInput {
  locationId: string;
  variantId: string;
  quantityChange: number;
  reason: AdjustmentReason;
  referenceType?: AdjustmentReferenceType;
  referenceId?: string;
  note?: string;
  userId?: string;
}

export interface TransferInventoryInput {
  fromLocationId: string;
  toLocationId: string;
  variantId: string;
  quantity: number;
  userId?: string;
  note?: string;
}

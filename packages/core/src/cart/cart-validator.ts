import type { ProductVariant } from '../types/product.js';
import { InsufficientStockError, ValidationError } from '../utils/errors.js';

/** Validate that the requested quantity is available in stock */
export function validateStock(variant: ProductVariant, requestedQuantity: number): void {
  if (requestedQuantity <= 0) {
    throw new ValidationError('Quantity must be at least 1', 'quantity');
  }

  if (variant.inventoryQuantity < requestedQuantity) {
    throw new InsufficientStockError(variant.id, requestedQuantity, variant.inventoryQuantity);
  }
}

/** Validate all items in a cart against current stock levels */
export function validateCartStock(
  items: Array<{ variantId: string; quantity: number; variant: ProductVariant }>,
): void {
  for (const item of items) {
    validateStock(item.variant, item.quantity);
  }
}

const MAX_CART_ITEMS = 100;
const MAX_ITEM_QUANTITY = 999;

/** Validate cart constraints */
export function validateCartConstraints(
  currentItemCount: number,
  quantity: number,
): void {
  if (quantity > MAX_ITEM_QUANTITY) {
    throw new ValidationError(
      `Maximum quantity per item is ${MAX_ITEM_QUANTITY}`,
      'quantity',
    );
  }

  if (currentItemCount >= MAX_CART_ITEMS) {
    throw new ValidationError(
      `Maximum ${MAX_CART_ITEMS} unique items per cart`,
      'items',
    );
  }
}

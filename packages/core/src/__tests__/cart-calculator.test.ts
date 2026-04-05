import { describe, it, expect } from 'vitest';
import {
  calculateItemTotal,
  calculateSubtotal,
  calculateCartTotals,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
} from '../cart/cart-calculator.js';
import type { CartItemWithVariant } from '../cart/cart-calculator.js';
import type { ProductVariant } from '../types/product.js';

function makeVariant(overrides: Partial<ProductVariant> = {}): ProductVariant {
  return {
    id: 'v1',
    productId: 'p1',
    sku: null,
    title: 'Default',
    price: 2000, // $20.00
    compareAtPrice: null,
    costPrice: null,
    weight: null,
    weightUnit: null,
    inventoryQuantity: 100,
    barcode: null,
    position: 0,
    options: {},
    ...overrides,
  };
}

function makeItem(overrides: Partial<CartItemWithVariant> = {}): CartItemWithVariant {
  const variant = makeVariant(overrides.variant ? overrides.variant : {});
  return {
    id: 'item1',
    cartId: 'cart1',
    variantId: variant.id,
    quantity: 1,
    metadata: null,
    variant,
    ...overrides,
  };
}

describe('cart calculator', () => {
  it('calculates item total', () => {
    const item = makeItem({ quantity: 3 });
    expect(calculateItemTotal(item)).toBe(6000);
  });

  it('calculates subtotal for multiple items', () => {
    const items = [
      makeItem({ id: 'i1', quantity: 2, variant: makeVariant({ id: 'v1', price: 1000 }) }),
      makeItem({ id: 'i2', quantity: 1, variant: makeVariant({ id: 'v2', price: 3000 }) }),
    ];
    expect(calculateSubtotal(items)).toBe(5000); // 2*10 + 1*30
  });

  it('calculates full cart totals', () => {
    const items = [makeItem({ quantity: 2 })];
    const totals = calculateCartTotals(items, 500, 320, 799);
    expect(totals.subtotal).toBe(4000); // 2 * $20
    expect(totals.discountTotal).toBe(500);
    expect(totals.taxTotal).toBe(320);
    expect(totals.shippingTotal).toBe(799);
    expect(totals.total).toBe(4619); // 4000 - 500 + 320 + 799
    expect(totals.itemCount).toBe(2);
  });

  it('clamps total to zero when discount exceeds subtotal', () => {
    const items = [makeItem({ quantity: 1 })];
    const totals = calculateCartTotals(items, 5000, 0, 0);
    expect(totals.total).toBe(0);
  });

  it('adds item to empty cart', () => {
    const variant = makeVariant({ id: 'v1' });
    const result = addItemToCart([], 'v1', 2, variant);
    expect(result).toHaveLength(1);
    expect(result[0].variantId).toBe('v1');
    expect(result[0].quantity).toBe(2);
  });

  it('increments quantity for existing item', () => {
    const variant = makeVariant({ id: 'v1' });
    const existing = [makeItem({ variantId: 'v1', quantity: 1, variant })];
    const result = addItemToCart(existing, 'v1', 3, variant);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(4);
  });

  it('updates item quantity', () => {
    const items = [makeItem({ id: 'item1', quantity: 2 })];
    const result = updateItemQuantity(items, 'item1', 5);
    expect(result[0].quantity).toBe(5);
  });

  it('removes item when quantity is zero', () => {
    const items = [makeItem({ id: 'item1' })];
    const result = updateItemQuantity(items, 'item1', 0);
    expect(result).toHaveLength(0);
  });

  it('removes item by id', () => {
    const items = [makeItem({ id: 'item1' }), makeItem({ id: 'item2' })];
    const result = removeItemFromCart(items, 'item1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('item2');
  });
});

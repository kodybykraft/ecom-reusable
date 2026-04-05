import { describe, it, expect } from 'vitest';
import { calculateDiscountAmount, validateDiscount } from '../discount/discount-engine.js';
import type { Discount } from '../types/discount.js';
import type { CartItemWithVariant } from '../cart/cart-calculator.js';
import type { ProductVariant } from '../types/product.js';

function makeDiscount(overrides: Partial<Discount> = {}): Discount {
  return {
    id: 'd1',
    code: 'TEST10',
    type: 'percentage',
    value: 10,
    minPurchaseAmount: null,
    minQuantity: null,
    usageLimit: null,
    usageCount: 0,
    appliesTo: { type: 'all' },
    startsAt: new Date('2020-01-01'),
    endsAt: null,
    isActive: true,
    createdAt: new Date(),
    ...overrides,
  };
}

function makeCartItems(price = 5000, quantity = 2): CartItemWithVariant[] {
  const variant: ProductVariant = {
    id: 'v1', productId: 'p1', sku: null, title: 'V1',
    price, compareAtPrice: null, costPrice: null,
    weight: null, weightUnit: null, inventoryQuantity: 100,
    barcode: null, position: 0, options: {},
  };
  return [{
    id: 'i1', cartId: 'c1', variantId: 'v1', quantity, metadata: null, variant,
  }];
}

describe('discount engine', () => {
  it('calculates percentage discount', () => {
    const discount = makeDiscount({ type: 'percentage', value: 10 });
    const items = makeCartItems(5000, 2); // subtotal = 10000
    expect(calculateDiscountAmount(discount, items, 10000)).toBe(1000); // 10% of $100
  });

  it('calculates fixed amount discount', () => {
    const discount = makeDiscount({ type: 'fixed_amount', value: 1500 });
    const items = makeCartItems(5000, 2);
    expect(calculateDiscountAmount(discount, items, 10000)).toBe(1500); // $15 off
  });

  it('caps fixed discount at subtotal', () => {
    const discount = makeDiscount({ type: 'fixed_amount', value: 50000 });
    const items = makeCartItems(5000, 2); // subtotal = 10000
    expect(calculateDiscountAmount(discount, items, 10000)).toBe(10000);
  });

  it('validates active discount', () => {
    const discount = makeDiscount();
    const items = makeCartItems();
    const result = validateDiscount(discount, items, 10000, null);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(1000);
  });

  it('rejects inactive discount', () => {
    const discount = makeDiscount({ isActive: false });
    const result = validateDiscount(discount, makeCartItems(), 10000, null);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Discount is not active');
  });

  it('rejects expired discount', () => {
    const discount = makeDiscount({ endsAt: new Date('2020-01-01') });
    const result = validateDiscount(discount, makeCartItems(), 10000, null);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Discount has expired');
  });

  it('rejects when below minimum purchase', () => {
    const discount = makeDiscount({ minPurchaseAmount: 20000 });
    const result = validateDiscount(discount, makeCartItems(), 10000, null);
    expect(result.valid).toBe(false);
  });

  it('rejects when usage limit reached', () => {
    const discount = makeDiscount({ usageLimit: 5, usageCount: 5 });
    const result = validateDiscount(discount, makeCartItems(), 10000, null);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Discount usage limit reached');
  });
});

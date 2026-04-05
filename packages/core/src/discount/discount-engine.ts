import type { Discount, DiscountValidationResult } from '../types/discount.js';
import type { Money } from '../types/common.js';
import type { CartItemWithVariant } from '../cart/cart-calculator.js';
import { percentageOf, clampMoney, sumMoney, multiplyMoney } from '../utils/money.js';
import { calculateItemTotal } from '../cart/cart-calculator.js';

/** Calculate the discount amount for a given discount and cart */
export function calculateDiscountAmount(
  discount: Discount,
  items: CartItemWithVariant[],
  subtotal: Money,
): Money {
  const eligibleItems = getEligibleItems(discount, items);
  const eligibleSubtotal = sumMoney(eligibleItems.map(calculateItemTotal));

  switch (discount.type) {
    case 'percentage':
      return percentageOf(eligibleSubtotal, discount.value);
    case 'fixed_amount':
      return clampMoney(Math.min(discount.value, eligibleSubtotal));
    case 'free_shipping':
      return 0; // shipping discount handled separately
  }
}

/** Validate whether a discount can be applied */
export function validateDiscount(
  discount: Discount,
  items: CartItemWithVariant[],
  subtotal: Money,
  customerId: string | null,
): DiscountValidationResult {
  const now = new Date();

  if (!discount.isActive) {
    return { valid: false, reason: 'Discount is not active', discountAmount: 0 };
  }

  if (now < discount.startsAt) {
    return { valid: false, reason: 'Discount has not started yet', discountAmount: 0 };
  }

  if (discount.endsAt && now > discount.endsAt) {
    return { valid: false, reason: 'Discount has expired', discountAmount: 0 };
  }

  if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
    return { valid: false, reason: 'Discount usage limit reached', discountAmount: 0 };
  }

  if (discount.minPurchaseAmount !== null && subtotal < discount.minPurchaseAmount) {
    return {
      valid: false,
      reason: `Minimum purchase amount is ${discount.minPurchaseAmount}`,
      discountAmount: 0,
    };
  }

  if (discount.minQuantity !== null) {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity < discount.minQuantity) {
      return {
        valid: false,
        reason: `Minimum quantity is ${discount.minQuantity}`,
        discountAmount: 0,
      };
    }
  }

  const eligibleItems = getEligibleItems(discount, items);
  if (eligibleItems.length === 0 && discount.type !== 'free_shipping') {
    return { valid: false, reason: 'No eligible items in cart', discountAmount: 0 };
  }

  const discountAmount = calculateDiscountAmount(discount, items, subtotal);
  return { valid: true, discountAmount };
}

/** Get cart items that are eligible for the discount */
function getEligibleItems(
  discount: Discount,
  items: CartItemWithVariant[],
): CartItemWithVariant[] {
  if (discount.appliesTo.type === 'all') {
    return items;
  }

  if (discount.appliesTo.type === 'products' && discount.appliesTo.productIds) {
    const productIds = new Set(discount.appliesTo.productIds);
    return items.filter((item) => productIds.has(item.variant.productId));
  }

  // collection filtering would require item-to-collection mapping
  // which is resolved at the service layer
  return items;
}

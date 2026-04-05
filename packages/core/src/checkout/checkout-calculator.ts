import type { Money } from '../types/common.js';
import { clampMoney } from '../utils/money.js';

export interface CheckoutCalculationInput {
  subtotal: Money;
  discountTotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
}

export interface CheckoutTotals {
  subtotal: Money;
  discountTotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
  total: Money;
}

/** Calculate the final checkout totals */
export function calculateCheckoutTotals(input: CheckoutCalculationInput): CheckoutTotals {
  const total = clampMoney(
    input.subtotal - input.discountTotal + input.shippingTotal + input.taxTotal,
  );

  return {
    subtotal: input.subtotal,
    discountTotal: input.discountTotal,
    shippingTotal: input.shippingTotal,
    taxTotal: input.taxTotal,
    total,
  };
}

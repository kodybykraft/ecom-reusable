import type { CartItem, CartTotals } from '../types/cart.js';
import type { Money } from '../types/common.js';
import type { ProductVariant } from '../types/product.js';
import { multiplyMoney, sumMoney, clampMoney, subtractMoney } from '../utils/money.js';

export interface CartItemWithVariant extends CartItem {
  variant: ProductVariant;
}

/** Calculate the subtotal for a single cart item */
export function calculateItemTotal(item: CartItemWithVariant): Money {
  return multiplyMoney(item.variant.price, item.quantity);
}

/** Calculate subtotal for all items in the cart */
export function calculateSubtotal(items: CartItemWithVariant[]): Money {
  return sumMoney(items.map(calculateItemTotal));
}

/** Calculate full cart totals given items, discount, tax, and shipping */
export function calculateCartTotals(
  items: CartItemWithVariant[],
  discountTotal: Money = 0,
  taxTotal: Money = 0,
  shippingTotal: Money = 0,
): CartTotals {
  const subtotal = calculateSubtotal(items);
  const total = clampMoney(subtotal - discountTotal + taxTotal + shippingTotal);

  return {
    subtotal,
    discountTotal,
    taxTotal,
    shippingTotal,
    total,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  };
}

/** Add an item to the cart items list. If variant already exists, increment quantity. */
export function addItemToCart(
  items: CartItemWithVariant[],
  variantId: string,
  quantity: number,
  variant: ProductVariant,
): CartItemWithVariant[] {
  const existing = items.find((item) => item.variantId === variantId);

  if (existing) {
    return items.map((item) =>
      item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item,
    );
  }

  const newItem: CartItemWithVariant = {
    id: '', // assigned by database
    cartId: '', // assigned by database
    variantId,
    quantity,
    metadata: null,
    variant,
  };

  return [...items, newItem];
}

/** Update the quantity of an item. Returns updated items, removing the item if quantity <= 0. */
export function updateItemQuantity(
  items: CartItemWithVariant[],
  itemId: string,
  quantity: number,
): CartItemWithVariant[] {
  if (quantity <= 0) {
    return items.filter((item) => item.id !== itemId);
  }
  return items.map((item) => (item.id === itemId ? { ...item, quantity } : item));
}

/** Remove an item from the cart */
export function removeItemFromCart(
  items: CartItemWithVariant[],
  itemId: string,
): CartItemWithVariant[] {
  return items.filter((item) => item.id !== itemId);
}

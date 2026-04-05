'use server';

import { getEcom } from '../create-ecom.js';

export async function getOrCreateCart(cartId?: string, customerId?: string) {
  const ecom = getEcom();
  return ecom.cart.getOrCreate(cartId, customerId);
}

export async function getCart(cartId: string) {
  const ecom = getEcom();
  return ecom.cart.getById(cartId);
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const ecom = getEcom();
  return ecom.cart.addItem(cartId, variantId, quantity);
}

export async function updateCartItem(cartId: string, itemId: string, quantity: number) {
  const ecom = getEcom();
  return ecom.cart.updateItemQuantity(cartId, itemId, quantity);
}

export async function removeFromCart(cartId: string, itemId: string) {
  const ecom = getEcom();
  return ecom.cart.removeItem(cartId, itemId);
}

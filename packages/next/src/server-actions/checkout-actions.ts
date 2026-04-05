'use server';

import { getEcom } from '../create-ecom.js';
import type { CreateCheckoutInput, UpdateCheckoutInput } from '@ecom/core';

export async function createCheckout(input: CreateCheckoutInput) {
  const ecom = getEcom();
  return ecom.checkout.create(input);
}

export async function updateCheckout(id: string, input: UpdateCheckoutInput) {
  const ecom = getEcom();
  return ecom.checkout.update(id, input);
}

export async function completeCheckout(checkoutId: string) {
  const ecom = getEcom();
  const checkout = await ecom.checkout.complete(checkoutId);
  const order = await ecom.orders.createFromCheckout(checkout as Parameters<typeof ecom.orders.createFromCheckout>[0]);
  return order;
}

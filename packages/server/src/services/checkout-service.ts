import { eq } from 'drizzle-orm';
import { checkouts, carts } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError, ValidationError } from '@ecom/core';
import type { CreateCheckoutInput, UpdateCheckoutInput } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class CheckoutService {
  constructor(private db: Database) {}

  async getById(id: string) {
    const checkout = await this.db.query.checkouts.findFirst({
      where: eq(checkouts.id, id),
      with: { cart: { with: { items: { with: { variant: true } } } } },
    });
    if (!checkout) throw new NotFoundError('Checkout', id);
    return checkout;
  }

  async create(input: CreateCheckoutInput) {
    const cart = await this.db.query.carts.findFirst({
      where: eq(carts.id, input.cartId),
      with: { items: { with: { variant: true } } },
    });
    if (!cart) throw new NotFoundError('Cart', input.cartId);
    if (cart.items.length === 0) throw new ValidationError('Cart is empty');

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0,
    );

    const [checkout] = await this.db
      .insert(checkouts)
      .values({
        cartId: input.cartId,
        customerId: input.customerId ?? null,
        email: input.email,
        subtotal,
        total: subtotal,
      })
      .returning();

    await eventBus.emit('checkout.created', { checkoutId: checkout.id, cartId: input.cartId });
    return this.getById(checkout.id);
  }

  async update(id: string, input: UpdateCheckoutInput) {
    const checkout = await this.getById(id);

    const updateData: Record<string, unknown> = {};
    if (input.email) updateData.email = input.email;
    if (input.shippingAddress) updateData.shippingAddress = input.shippingAddress;
    if (input.billingAddress) updateData.billingAddress = input.billingAddress;
    if (input.shippingMethodId) updateData.shippingMethodId = input.shippingMethodId;

    if (Object.keys(updateData).length > 0) {
      await this.db.update(checkouts).set(updateData).where(eq(checkouts.id, id));
    }

    await eventBus.emit('checkout.updated', { checkoutId: id });
    return this.getById(id);
  }

  async complete(id: string) {
    const checkout = await this.getById(id);
    if (checkout.status === 'completed') {
      throw new ValidationError('Checkout already completed');
    }
    if (!checkout.email) {
      throw new ValidationError('Checkout is missing an email address');
    }
    if (!checkout.shippingAddress) {
      throw new ValidationError('Checkout is missing a shipping address');
    }
    if (!checkout.cart || checkout.cart.items.length === 0) {
      throw new ValidationError('Checkout cart has no items');
    }

    await this.db
      .update(checkouts)
      .set({ status: 'completed', completedAt: new Date() })
      .where(eq(checkouts.id, id));

    await this.db
      .update(carts)
      .set({ status: 'converted' })
      .where(eq(carts.id, checkout.cartId));

    await eventBus.emit('checkout.completed', { checkoutId: id, orderId: '' });

    return this.getById(id);
  }
}

import { eq, and } from 'drizzle-orm';
import { carts, cartItems, productVariants } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError, validateStock, validateCartConstraints } from '@ecom/core';
import type { ProductVariant } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class CartService {
  constructor(private db: Database) {}

  async getOrCreate(cartId?: string, customerId?: string) {
    if (cartId) {
      const cart = await this.db.query.carts.findFirst({
        where: eq(carts.id, cartId),
        with: { items: { with: { variant: { with: { product: true } } } } },
      });
      if (cart) return cart;
    }

    const [cart] = await this.db
      .insert(carts)
      .values({ customerId: customerId ?? null, currency: 'USD' })
      .returning();

    await eventBus.emit('cart.created', { cartId: cart.id });
    return { ...cart, items: [] };
  }

  async getById(id: string) {
    const cart = await this.db.query.carts.findFirst({
      where: eq(carts.id, id),
      with: { items: { with: { variant: { with: { product: true } } } } },
    });
    if (!cart) throw new NotFoundError('Cart', id);
    return cart;
  }

  async addItem(cartId: string, variantId: string, quantity: number) {
    const cart = await this.getById(cartId);
    const variant = await this.db.query.productVariants.findFirst({
      where: eq(productVariants.id, variantId),
    });
    if (!variant) throw new NotFoundError('Variant', variantId);

    validateStock(variant as unknown as ProductVariant, quantity);

    const existingItem = cart.items.find((item) => item.variantId === variantId);

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      validateStock(variant as unknown as ProductVariant, newQty);
      await this.db
        .update(cartItems)
        .set({ quantity: newQty })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      validateCartConstraints(cart.items.length, quantity);
      await this.db.insert(cartItems).values({ cartId, variantId, quantity });
    }

    await eventBus.emit('cart.item_added', { cartId, variantId });
    return this.getById(cartId);
  }

  async updateItemQuantity(cartId: string, itemId: string, quantity: number) {
    const cart = await this.getById(cartId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundError('CartItem', itemId);

    if (quantity <= 0) {
      await this.db.delete(cartItems).where(eq(cartItems.id, itemId));
    } else {
      const variant = await this.db.query.productVariants.findFirst({
        where: eq(productVariants.id, item.variantId),
      });
      if (variant) validateStock(variant as unknown as ProductVariant, quantity);
      await this.db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
    }

    await eventBus.emit('cart.updated', { cartId });
    return this.getById(cartId);
  }

  async removeItem(cartId: string, itemId: string) {
    const cart = await this.getById(cartId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundError('CartItem', itemId);

    await this.db.delete(cartItems).where(eq(cartItems.id, itemId));
    await eventBus.emit('cart.item_removed', { cartId, variantId: item.variantId });
    return this.getById(cartId);
  }
}

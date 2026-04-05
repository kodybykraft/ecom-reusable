import { eq, desc, and, sql } from 'drizzle-orm';
import { orders, orderLineItems, orderTransactions, productVariants } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError } from '@ecom/core';
import type { OrderFilter, PaginationInput } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class OrderService {
  constructor(private db: Database) {}

  async list(filter?: OrderFilter, pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (filter?.financialStatus) conditions.push(eq(orders.financialStatus, filter.financialStatus));
    if (filter?.fulfillmentStatus) conditions.push(eq(orders.fulfillmentStatus, filter.fulfillmentStatus));
    if (filter?.customerId) conditions.push(eq(orders.customerId, filter.customerId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.orders.findMany({
        where,
        with: { lineItems: true, transactions: true },
        limit: pageSize,
        offset,
        orderBy: desc(orders.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(orders).where(where),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string) {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: { lineItems: true, transactions: true, customer: true },
    });
    if (!order) throw new NotFoundError('Order', id);
    return order;
  }

  async createFromCheckout(checkout: {
    id: string;
    email: string;
    customerId: string | null;
    subtotal: number;
    shippingTotal: number;
    taxTotal: number;
    discountTotal: number;
    total: number;
    shippingAddress: unknown;
    billingAddress: unknown;
    cart: { items: Array<{ variant: { id: string; productId: string; title: string; sku: string | null; price: number }; quantity: number }> };
  }) {
    const [order] = await this.db
      .insert(orders)
      .values({
        checkoutId: checkout.id,
        customerId: checkout.customerId,
        email: checkout.email,
        subtotal: checkout.subtotal,
        shippingTotal: checkout.shippingTotal,
        taxTotal: checkout.taxTotal,
        discountTotal: checkout.discountTotal,
        total: checkout.total,
        shippingAddress: checkout.shippingAddress,
        billingAddress: checkout.billingAddress,
      })
      .returning();

    if (checkout.cart.items.length > 0) {
      await this.db.insert(orderLineItems).values(
        checkout.cart.items.map((item) => ({
          orderId: order.id,
          variantId: item.variant.id,
          title: item.variant.title,
          variantTitle: item.variant.title,
          sku: item.variant.sku,
          quantity: item.quantity,
          price: item.variant.price,
          totalDiscount: 0,
          taxLines: [],
        })),
      );

      // Decrement inventory
      for (const item of checkout.cart.items) {
        await this.db
          .update(productVariants)
          .set({ inventoryQuantity: sql`${productVariants.inventoryQuantity} - ${item.quantity}` })
          .where(eq(productVariants.id, item.variant.id));
      }
    }

    await eventBus.emit('order.created', { orderId: order.id, customerId: checkout.customerId ?? undefined });
    return this.getById(order.id);
  }

  async updateFulfillmentStatus(id: string, status: 'unfulfilled' | 'partial' | 'fulfilled') {
    await this.getById(id);
    await this.db.update(orders).set({ fulfillmentStatus: status }).where(eq(orders.id, id));
    if (status === 'fulfilled') {
      await eventBus.emit('order.fulfilled', { orderId: id });
    }
    return this.getById(id);
  }

  async cancel(id: string) {
    await this.getById(id);
    await this.db
      .update(orders)
      .set({ cancelledAt: new Date(), financialStatus: 'refunded' })
      .where(eq(orders.id, id));
    await eventBus.emit('order.cancelled', { orderId: id });
    return this.getById(id);
  }
}

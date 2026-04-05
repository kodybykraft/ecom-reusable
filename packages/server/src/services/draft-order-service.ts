import { eq, desc, sql } from 'drizzle-orm';
import { draftOrders, draftOrderLineItems, orders, orderLineItems } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError, ValidationError } from '@ecom/core';
import type { PaginationInput } from '@ecom/core';

export class DraftOrderService {
  constructor(private db: Database) {}

  async list(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db.query.draftOrders.findMany({
        limit: pageSize,
        offset,
        orderBy: desc(draftOrders.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(draftOrders),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string) {
    const draft = await this.db.query.draftOrders.findFirst({
      where: eq(draftOrders.id, id),
      with: { lineItems: true },
    });
    if (!draft) throw new NotFoundError('DraftOrder', id);
    return draft;
  }

  async create(input: { email?: string; customerId?: string; notes?: string }) {
    const [draft] = await this.db
      .insert(draftOrders)
      .values({
        email: input.email,
        customerId: input.customerId,
        notes: input.notes,
      })
      .returning();
    return draft;
  }

  async update(id: string, data: {
    email?: string;
    shippingAddress?: unknown;
    billingAddress?: unknown;
    discountCode?: string;
    notes?: string;
  }) {
    await this.getById(id);
    const [updated] = await this.db
      .update(draftOrders)
      .set(data)
      .where(eq(draftOrders.id, id))
      .returning();
    return updated;
  }

  async addLineItem(draftId: string, item: {
    variantId: string;
    title: string;
    variantTitle: string;
    sku?: string;
    quantity: number;
    price: number;
  }) {
    await this.getById(draftId);

    const [lineItem] = await this.db
      .insert(draftOrderLineItems)
      .values({
        draftOrderId: draftId,
        variantId: item.variantId,
        title: item.title,
        variantTitle: item.variantTitle,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
      })
      .returning();

    await this.recalculateTotals(draftId);
    return lineItem;
  }

  async removeLineItem(draftId: string, itemId: string) {
    await this.getById(draftId);

    const item = await this.db.query.draftOrderLineItems.findFirst({
      where: eq(draftOrderLineItems.id, itemId),
    });
    if (!item) throw new NotFoundError('DraftOrderLineItem', itemId);

    await this.db.delete(draftOrderLineItems).where(eq(draftOrderLineItems.id, itemId));
    await this.recalculateTotals(draftId);
  }

  async updateLineItem(draftId: string, itemId: string, data: { quantity?: number; price?: number }) {
    await this.getById(draftId);

    const item = await this.db.query.draftOrderLineItems.findFirst({
      where: eq(draftOrderLineItems.id, itemId),
    });
    if (!item) throw new NotFoundError('DraftOrderLineItem', itemId);

    const [updated] = await this.db
      .update(draftOrderLineItems)
      .set(data)
      .where(eq(draftOrderLineItems.id, itemId))
      .returning();

    await this.recalculateTotals(draftId);
    return updated;
  }

  async recalculateTotals(draftId: string) {
    const items = await this.db.query.draftOrderLineItems.findMany({
      where: eq(draftOrderLineItems.draftOrderId, draftId),
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await this.db
      .update(draftOrders)
      .set({ subtotal, total: subtotal })
      .where(eq(draftOrders.id, draftId));
  }

  async convertToOrder(draftId: string) {
    const draft = await this.getById(draftId);
    if (!draft.email) throw new ValidationError('Draft order must have an email before converting');

    // Create the real order
    const [order] = await this.db
      .insert(orders)
      .values({
        customerId: draft.customerId,
        email: draft.email,
        subtotal: draft.subtotal,
        shippingTotal: draft.shippingTotal,
        taxTotal: draft.taxTotal,
        discountTotal: draft.discountTotal,
        total: draft.total,
        shippingAddress: draft.shippingAddress,
        billingAddress: draft.billingAddress,
      })
      .returning();

    // Copy line items to order line items
    if (draft.lineItems.length > 0) {
      await this.db.insert(orderLineItems).values(
        draft.lineItems.map((item) => ({
          orderId: order.id,
          variantId: item.variantId,
          title: item.title,
          variantTitle: item.variantTitle,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
          totalDiscount: 0,
          taxLines: [],
        })),
      );
    }

    // Mark draft as completed
    await this.db
      .update(draftOrders)
      .set({ status: 'completed', completedOrderId: order.id })
      .where(eq(draftOrders.id, draftId));

    return order;
  }

  async delete(draftId: string) {
    const draft = await this.getById(draftId);
    if (draft.status !== 'open') throw new ValidationError('Can only delete draft orders with status "open"');

    await this.db.delete(draftOrders).where(eq(draftOrders.id, draftId));
  }
}

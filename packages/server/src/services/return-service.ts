import { eq, desc, and, asc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { returns, returnLineItems, returnReasons, orders, orderLineItems } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError, ValidationError } from '@ecom/core';
import type { PaginationInput } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class ReturnService {
  constructor(private db: Database) {}

  async list(filter?: { status?: string; orderId?: string }, pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (filter?.status) conditions.push(eq(returns.status, filter.status));
    if (filter?.orderId) conditions.push(eq(returns.orderId, filter.orderId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.returns.findMany({
        where,
        with: { lineItems: true },
        limit: pageSize,
        offset,
        orderBy: desc(returns.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(returns).where(where),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string) {
    const returnRecord = await this.db.query.returns.findFirst({
      where: eq(returns.id, id),
      with: { lineItems: true, order: true, customer: true },
    });
    if (!returnRecord) throw new NotFoundError('Return', id);
    return returnRecord;
  }

  async create(input: {
    orderId: string;
    customerId?: string;
    items: Array<{
      orderLineItemId: string;
      quantity: number;
      reasonId: string;
      condition: string;
      note?: string;
      restock?: boolean;
    }>;
  }) {
    // Validate order exists
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, input.orderId),
    });
    if (!order) throw new NotFoundError('Order', input.orderId);

    if (input.items.length === 0) throw new ValidationError('At least one return item is required');

    // Calculate total refund from line item prices
    let totalRefund = 0;
    for (const item of input.items) {
      const lineItem = await this.db.query.orderLineItems.findFirst({
        where: eq(orderLineItems.id, item.orderLineItemId),
      });
      if (!lineItem) throw new NotFoundError('OrderLineItem', item.orderLineItemId);
      totalRefund += lineItem.price * item.quantity;
    }

    // Create return record
    const [returnRecord] = await this.db
      .insert(returns)
      .values({
        orderId: input.orderId,
        customerId: input.customerId ?? order.customerId,
        totalRefund,
        refundMethod: 'original_payment',
      })
      .returning();

    // Create return line items
    await this.db.insert(returnLineItems).values(
      input.items.map((item) => ({
        returnId: returnRecord.id,
        orderLineItemId: item.orderLineItemId,
        quantity: item.quantity,
        reasonId: item.reasonId,
        condition: item.condition,
        note: item.note,
        restock: item.restock ?? true,
      })),
    );

    await eventBus.emit('return.created', { returnId: returnRecord.id, orderId: input.orderId });
    return this.getById(returnRecord.id);
  }

  async approve(id: string) {
    await this.getById(id);
    await this.db
      .update(returns)
      .set({ status: 'approved', approvedAt: new Date() })
      .where(eq(returns.id, id));
    await eventBus.emit('return.approved', { returnId: id });
    return this.getById(id);
  }

  async markReceived(id: string) {
    await this.getById(id);
    await this.db
      .update(returns)
      .set({ status: 'received', receivedAt: new Date() })
      .where(eq(returns.id, id));
    await eventBus.emit('return.received', { returnId: id });
    return this.getById(id);
  }

  async processRefund(id: string) {
    await this.getById(id);
    await this.db
      .update(returns)
      .set({ status: 'refunded', completedAt: new Date() })
      .where(eq(returns.id, id));
    await eventBus.emit('return.refunded', { returnId: id });
    return this.getById(id);
  }

  async restock(id: string) {
    await this.getById(id);
    await this.db
      .update(returns)
      .set({ status: 'restocked', completedAt: new Date() })
      .where(eq(returns.id, id));
    await eventBus.emit('return.restocked', { returnId: id });
    return this.getById(id);
  }

  async reject(id: string, reason?: string) {
    const returnRecord = await this.getById(id);
    const notes = reason
      ? returnRecord.notes ? `${returnRecord.notes}\nRejection reason: ${reason}` : `Rejection reason: ${reason}`
      : returnRecord.notes;
    await this.db
      .update(returns)
      .set({ status: 'rejected', notes })
      .where(eq(returns.id, id));
    await eventBus.emit('return.rejected', { returnId: id });
    return this.getById(id);
  }

  async listReasons() {
    return this.db.query.returnReasons.findMany({
      orderBy: asc(returnReasons.position),
    });
  }
}

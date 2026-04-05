import { eq, desc, sql } from 'drizzle-orm';
import { discounts, discountUsages } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { CreateDiscountInput, PaginationInput } from '@ecom/core';
import { NotFoundError } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class DiscountService {
  constructor(private db: Database) {}

  async list(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db.query.discounts.findMany({
        limit: pageSize,
        offset,
        orderBy: desc(discounts.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(discounts),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string) {
    const discount = await this.db.query.discounts.findFirst({
      where: eq(discounts.id, id),
    });
    if (!discount) throw new NotFoundError('Discount', id);
    return discount;
  }

  async getByCode(code: string) {
    const discount = await this.db.query.discounts.findFirst({
      where: eq(discounts.code, code.toUpperCase()),
    });
    if (!discount) throw new NotFoundError('Discount', code);
    return discount;
  }

  async create(input: CreateDiscountInput) {
    const [discount] = await this.db
      .insert(discounts)
      .values({
        code: input.code.toUpperCase(),
        type: input.type,
        value: input.value,
        minPurchaseAmount: input.minPurchaseAmount ?? null,
        minQuantity: input.minQuantity ?? null,
        usageLimit: input.usageLimit ?? null,
        appliesTo: input.appliesTo ?? { type: 'all' },
        startsAt: input.startsAt ?? new Date(),
        endsAt: input.endsAt ?? null,
        isActive: input.isActive ?? true,
      })
      .returning();

    await eventBus.emit('discount.created', { discountId: discount.id });
    return discount;
  }

  async update(id: string, data: Partial<CreateDiscountInput>) {
    await this.getById(id);
    const updateData: Record<string, unknown> = {};
    if (data.code) updateData.code = data.code.toUpperCase();
    if (data.type) updateData.type = data.type;
    if (data.value !== undefined) updateData.value = data.value;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.startsAt) updateData.startsAt = data.startsAt;
    if (data.endsAt !== undefined) updateData.endsAt = data.endsAt;

    await this.db.update(discounts).set(updateData).where(eq(discounts.id, id));
    return this.getById(id);
  }

  async recordUsage(discountId: string, orderId: string, customerId: string | null) {
    await this.db.insert(discountUsages).values({
      discountId,
      orderId,
      customerId,
    });
    await this.db
      .update(discounts)
      .set({ usageCount: sql`${discounts.usageCount} + 1` })
      .where(eq(discounts.id, discountId));
    await eventBus.emit('discount.used', { discountId, orderId });
  }

  async delete(id: string) {
    await this.getById(id);
    await this.db.delete(discounts).where(eq(discounts.id, id));
  }
}

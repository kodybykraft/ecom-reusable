import { eq, desc, sql, or, and, lt } from 'drizzle-orm';
import { checkouts, carts, cartItems } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { PaginationInput } from '@ecom/core';
import { NotFoundError } from '@ecom/core';

export class AbandonedCheckoutService {
  constructor(private db: Database) {}

  async list(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const abandonedFilter = or(
      eq(checkouts.status, 'abandoned'),
      and(eq(checkouts.status, 'pending'), lt(checkouts.createdAt, oneHourAgo)),
    );

    const [data, countResult] = await Promise.all([
      this.db.query.checkouts.findMany({
        where: abandonedFilter,
        limit: pageSize,
        offset,
        orderBy: desc(checkouts.createdAt),
      }),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(checkouts)
        .where(abandonedFilter!),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string) {
    const checkout = await this.db.query.checkouts.findFirst({
      where: eq(checkouts.id, id),
      with: {
        cart: {
          with: { items: true },
        },
      },
    });
    if (!checkout) throw new NotFoundError('Checkout', id);
    return checkout;
  }

  async getStats() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const abandonedFilter = or(
      eq(checkouts.status, 'abandoned'),
      and(eq(checkouts.status, 'pending'), lt(checkouts.createdAt, oneHourAgo)),
    );

    const [result] = await this.db
      .select({
        count: sql<number>`count(*)`,
        totalValue: sql<number>`coalesce(sum(${checkouts.total}), 0)`,
      })
      .from(checkouts)
      .where(abandonedFilter!);

    return {
      count: Number(result.count),
      totalValue: Number(result.totalValue),
    };
  }
}

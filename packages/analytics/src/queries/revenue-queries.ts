import { sql, gte, lte, and, eq } from 'drizzle-orm';
import { orders } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { DateRange } from '../types/metrics.js';

export class RevenueQueries {
  constructor(private db: Database) {}

  async getTotalRevenue(range: DateRange): Promise<number> {
    const result = await this.db
      .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)` })
      .from(orders)
      .where(and(
        eq(orders.financialStatus, 'paid'),
        gte(orders.createdAt, range.from),
        lte(orders.createdAt, range.to),
      ));
    return Number(result[0].total);
  }

  async getOrderCount(range: DateRange): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(gte(orders.createdAt, range.from), lte(orders.createdAt, range.to)));
    return Number(result[0].count);
  }

  async getAverageOrderValue(range: DateRange): Promise<number> {
    const result = await this.db
      .select({ avg: sql<number>`coalesce(avg(${orders.total}), 0)` })
      .from(orders)
      .where(and(
        eq(orders.financialStatus, 'paid'),
        gte(orders.createdAt, range.from),
        lte(orders.createdAt, range.to),
      ));
    return Math.round(Number(result[0].avg));
  }

  async getRevenueByDay(range: DateRange) {
    return this.db
      .select({
        date: sql<string>`date_trunc('day', ${orders.createdAt})::date`,
        revenue: sql<number>`sum(${orders.total})`,
        orderCount: sql<number>`count(*)`,
      })
      .from(orders)
      .where(and(
        eq(orders.financialStatus, 'paid'),
        gte(orders.createdAt, range.from),
        lte(orders.createdAt, range.to),
      ))
      .groupBy(sql`date_trunc('day', ${orders.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${orders.createdAt})::date`);
  }

  async getRefundRate(range: DateRange): Promise<number> {
    const [totalOrders, refundedOrders] = await Promise.all([
      this.getOrderCount(range),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(and(
          sql`${orders.financialStatus} in ('refunded', 'partially_refunded')`,
          gte(orders.createdAt, range.from),
          lte(orders.createdAt, range.to),
        ))
        .then((r) => Number(r[0].count)),
    ]);

    return totalOrders > 0 ? (refundedOrders / totalOrders) * 100 : 0;
  }
}

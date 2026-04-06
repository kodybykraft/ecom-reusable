import { sql, gte, lte, and, eq, desc } from 'drizzle-orm';
import { orders, customers, orderLineItems } from '@ecom/db';
import type { Database } from '@ecom/db';

export class AnalyticsQueryService {
  constructor(private db: Database) {}

  async getDashboardStats(dateRange: { from: Date; to: Date }) {
    const dateFilter = and(
      gte(orders.createdAt, dateRange.from),
      lte(orders.createdAt, dateRange.to),
    );

    const [salesResult, customerResult] = await Promise.all([
      this.db
        .select({
          totalSales: sql<number>`coalesce(sum(${orders.total}), 0)`,
          orderCount: sql<number>`count(*)`,
          avgOrderValue: sql<number>`coalesce(avg(${orders.total}), 0)`,
        })
        .from(orders)
        .where(dateFilter),
      this.db
        .select({ customerCount: sql<number>`count(*)` })
        .from(customers)
        .where(
          and(
            gte(customers.createdAt, dateRange.from),
            lte(customers.createdAt, dateRange.to),
          ),
        ),
    ]);

    return {
      totalSales: Number(salesResult[0].totalSales),
      orderCount: Number(salesResult[0].orderCount),
      customerCount: Number(customerResult[0].customerCount),
      avgOrderValue: Number(salesResult[0].avgOrderValue),
    };
  }

  async getSalesByDay(dateRange: { from: Date; to: Date }) {
    const dateFilter = and(
      gte(orders.createdAt, dateRange.from),
      lte(orders.createdAt, dateRange.to),
    );

    const data = await this.db
      .select({
        date: sql<string>`date_trunc('day', ${orders.createdAt})::date`,
        totalSales: sql<number>`coalesce(sum(${orders.total}), 0)`,
        orderCount: sql<number>`count(*)`,
      })
      .from(orders)
      .where(dateFilter)
      .groupBy(sql`date_trunc('day', ${orders.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${orders.createdAt})::date`);

    return data.map((row) => ({
      date: String(row.date),
      totalSales: Number(row.totalSales),
      orderCount: Number(row.orderCount),
    }));
  }

  async getTopProducts(dateRange: { from: Date; to: Date }, limit = 10) {
    return this.db
      .select({
        variantId: orderLineItems.variantId,
        title: orderLineItems.title,
        totalQuantity: sql<number>`sum(${orderLineItems.quantity})`,
        totalRevenue: sql<number>`sum(${orderLineItems.quantity} * ${orderLineItems.price})`,
      })
      .from(orderLineItems)
      .innerJoin(orders, eq(orders.id, orderLineItems.orderId))
      .where(and(
        gte(orders.createdAt, dateRange.from),
        lte(orders.createdAt, dateRange.to),
      ))
      .groupBy(orderLineItems.variantId, orderLineItems.title)
      .orderBy(sql`sum(${orderLineItems.quantity} * ${orderLineItems.price}) desc`)
      .limit(limit);
  }
}

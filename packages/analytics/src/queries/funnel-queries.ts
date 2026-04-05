import { sql, gte, lte, and, eq, inArray } from 'drizzle-orm';
import { analyticsEvents } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { DateRange } from '../types/metrics.js';

export interface FunnelStep {
  name: string;
  eventName: string;
  count: number;
  dropoff: number; // percentage dropped from previous step
}

export class FunnelQueries {
  constructor(private db: Database) {}

  async getCheckoutFunnel(range: DateRange): Promise<FunnelStep[]> {
    const steps = [
      { name: 'Product Viewed', eventName: 'product_viewed' },
      { name: 'Added to Cart', eventName: 'add_to_cart' },
      { name: 'Checkout Started', eventName: 'checkout_started' },
      { name: 'Payment Submitted', eventName: 'payment_submitted' },
      { name: 'Order Completed', eventName: 'order_completed' },
    ];

    const eventNames = steps.map((s) => s.eventName);

    const counts = await this.db
      .select({
        eventName: analyticsEvents.eventName,
        uniqueVisitors: sql<number>`count(distinct ${analyticsEvents.visitorId})`,
      })
      .from(analyticsEvents)
      .where(and(
        inArray(analyticsEvents.eventName, eventNames),
        gte(analyticsEvents.createdAt, range.from),
        lte(analyticsEvents.createdAt, range.to),
      ))
      .groupBy(analyticsEvents.eventName);

    const countMap = new Map(counts.map((c) => [c.eventName, Number(c.uniqueVisitors)]));

    return steps.map((step, i) => {
      const count = countMap.get(step.eventName) ?? 0;
      const prevCount = i === 0 ? count : (countMap.get(steps[i - 1].eventName) ?? 0);
      const dropoff = prevCount > 0 ? ((prevCount - count) / prevCount) * 100 : 0;

      return { name: step.name, eventName: step.eventName, count, dropoff: Math.round(dropoff * 10) / 10 };
    });
  }

  async getConversionRate(range: DateRange): Promise<number> {
    const [visitors, orders] = await Promise.all([
      this.db
        .select({ count: sql<number>`count(distinct ${analyticsEvents.visitorId})` })
        .from(analyticsEvents)
        .where(and(gte(analyticsEvents.createdAt, range.from), lte(analyticsEvents.createdAt, range.to))),
      this.db
        .select({ count: sql<number>`count(distinct ${analyticsEvents.visitorId})` })
        .from(analyticsEvents)
        .where(and(
          eq(analyticsEvents.eventName, 'order_completed'),
          gte(analyticsEvents.createdAt, range.from),
          lte(analyticsEvents.createdAt, range.to),
        )),
    ]);

    const totalVisitors = Number(visitors[0].count);
    const totalOrders = Number(orders[0].count);
    return totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
  }
}

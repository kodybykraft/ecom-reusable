import { sql, gte, lte, and, eq } from 'drizzle-orm';
import { analyticsSessions, analyticsEvents } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { DateRange } from '../types/metrics.js';

export class TrafficQueries {
  constructor(private db: Database) {}

  async getSessionCount(range: DateRange): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsSessions)
      .where(and(gte(analyticsSessions.startedAt, range.from), lte(analyticsSessions.startedAt, range.to)));
    return Number(result[0].count);
  }

  async getPageViews(range: DateRange): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(and(
        eq(analyticsEvents.eventName, 'page_view'),
        gte(analyticsEvents.createdAt, range.from),
        lte(analyticsEvents.createdAt, range.to),
      ));
    return Number(result[0].count);
  }

  async getTopSources(range: DateRange, limit = 10) {
    return this.db
      .select({
        source: analyticsSessions.utmSource,
        medium: analyticsSessions.utmMedium,
        sessions: sql<number>`count(*)`,
      })
      .from(analyticsSessions)
      .where(and(gte(analyticsSessions.startedAt, range.from), lte(analyticsSessions.startedAt, range.to)))
      .groupBy(analyticsSessions.utmSource, analyticsSessions.utmMedium)
      .orderBy(sql`count(*) desc`)
      .limit(limit);
  }

  async getDeviceBreakdown(range: DateRange) {
    return this.db
      .select({
        deviceType: analyticsSessions.deviceType,
        count: sql<number>`count(*)`,
      })
      .from(analyticsSessions)
      .where(and(gte(analyticsSessions.startedAt, range.from), lte(analyticsSessions.startedAt, range.to)))
      .groupBy(analyticsSessions.deviceType);
  }

  async getSessionsByDay(range: DateRange) {
    return this.db
      .select({
        date: sql<string>`date_trunc('day', ${analyticsSessions.startedAt})::date`,
        sessions: sql<number>`count(*)`,
      })
      .from(analyticsSessions)
      .where(and(gte(analyticsSessions.startedAt, range.from), lte(analyticsSessions.startedAt, range.to)))
      .groupBy(sql`date_trunc('day', ${analyticsSessions.startedAt})::date`)
      .orderBy(sql`date_trunc('day', ${analyticsSessions.startedAt})::date`);
  }
}

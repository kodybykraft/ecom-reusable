import { analyticsEvents, analyticsSessions } from '@ecom/db';
import type { Database } from '@ecom/db';
import { eq, sql } from 'drizzle-orm';
import type { AnalyticsEvent } from '../types/events.js';

export class EventCollector {
  constructor(private db: Database) {}

  async track(event: AnalyticsEvent): Promise<void> {
    await this.db.insert(analyticsEvents).values({
      eventName: event.eventName,
      sessionId: event.sessionId,
      visitorId: event.visitorId,
      customerId: event.customerId ?? null,
      properties: event.properties ?? null,
      pageUrl: event.pageUrl ?? null,
      referrer: event.referrer ?? null,
      userAgent: event.userAgent ?? null,
      ipAddress: event.ipAddress ?? null,
    });

    // Update session event count
    await this.db
      .update(analyticsSessions)
      .set({
        eventsCount: sql`${analyticsSessions.eventsCount} + 1`,
        endedAt: new Date(),
        ...(event.eventName === 'page_view' ? { pageCount: sql`${analyticsSessions.pageCount} + 1` } : {}),
      })
      .where(eq(analyticsSessions.id, event.sessionId));
  }

  async trackBatch(events: AnalyticsEvent[]): Promise<void> {
    if (events.length === 0) return;

    await this.db.insert(analyticsEvents).values(
      events.map((e) => ({
        eventName: e.eventName,
        sessionId: e.sessionId,
        visitorId: e.visitorId,
        customerId: e.customerId ?? null,
        properties: e.properties ?? null,
        pageUrl: e.pageUrl ?? null,
        referrer: e.referrer ?? null,
        userAgent: e.userAgent ?? null,
        ipAddress: e.ipAddress ?? null,
      })),
    );
  }
}

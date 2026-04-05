import { analyticsSessions } from '@ecom/db';
import type { Database } from '@ecom/db';
import { eq } from 'drizzle-orm';

export class SessionManager {
  constructor(private db: Database) {}

  async getOrCreateSession(input: {
    visitorId: string;
    customerId?: string;
    landingPage?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    country?: string;
    city?: string;
  }): Promise<string> {
    // Check for an active session (within last 30 minutes)
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existingSessions = await this.db.query.analyticsSessions.findMany({
      where: eq(analyticsSessions.visitorId, input.visitorId),
      orderBy: (s, { desc }) => [desc(s.startedAt)],
      limit: 1,
    });

    const existing = existingSessions[0];
    if (existing && existing.startedAt > thirtyMinAgo) {
      // Extend the existing session
      await this.db
        .update(analyticsSessions)
        .set({ endedAt: new Date(), customerId: input.customerId ?? existing.customerId })
        .where(eq(analyticsSessions.id, existing.id));
      return existing.id;
    }

    // Create a new session
    const [session] = await this.db
      .insert(analyticsSessions)
      .values({
        visitorId: input.visitorId,
        customerId: input.customerId ?? null,
        landingPage: input.landingPage ?? null,
        referrer: input.referrer ?? null,
        utmSource: input.utmSource ?? null,
        utmMedium: input.utmMedium ?? null,
        utmCampaign: input.utmCampaign ?? null,
        utmTerm: input.utmTerm ?? null,
        utmContent: input.utmContent ?? null,
        deviceType: input.deviceType ?? null,
        browser: input.browser ?? null,
        os: input.os ?? null,
        country: input.country ?? null,
        city: input.city ?? null,
      })
      .returning();

    return session.id;
  }

  async linkCustomer(visitorId: string, customerId: string): Promise<void> {
    await this.db
      .update(analyticsSessions)
      .set({ customerId })
      .where(eq(analyticsSessions.visitorId, visitorId));
  }
}

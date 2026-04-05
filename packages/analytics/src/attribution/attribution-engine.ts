import { eq, inArray } from 'drizzle-orm';
import { attributionTouchpoints } from '@ecom/db';
import type { Database } from '@ecom/db';

export type AttributionModel = 'first_touch' | 'last_touch' | 'linear';

export interface AttributionResult {
  channel: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  credit: number; // 0-1
}

export class AttributionEngine {
  constructor(private db: Database) {}

  async recordTouchpoint(input: {
    visitorId: string;
    customerId?: string;
    channel: string;
    source?: string;
    medium?: string;
    campaign?: string;
    touchpointUrl?: string;
  }): Promise<void> {
    await this.db.insert(attributionTouchpoints).values({
      visitorId: input.visitorId,
      customerId: input.customerId ?? null,
      channel: input.channel,
      source: input.source ?? null,
      medium: input.medium ?? null,
      campaign: input.campaign ?? null,
      touchpointUrl: input.touchpointUrl ?? null,
    });
  }

  async attributeOrder(
    orderId: string,
    visitorId: string,
    model: AttributionModel = 'last_touch',
  ): Promise<AttributionResult[]> {
    const touchpoints = await this.db.query.attributionTouchpoints.findMany({
      where: eq(attributionTouchpoints.visitorId, visitorId),
      orderBy: (t, { asc }) => [asc(t.touchedAt)],
    });

    if (touchpoints.length === 0) return [];

    // Link touchpoints to order (batch update)
    await this.db
      .update(attributionTouchpoints)
      .set({ orderId })
      .where(inArray(attributionTouchpoints.id, touchpoints.map(tp => tp.id)));

    switch (model) {
      case 'first_touch':
        return [this.toResult(touchpoints[0], 1)];
      case 'last_touch':
        return [this.toResult(touchpoints[touchpoints.length - 1], 1)];
      case 'linear': {
        const credit = 1 / touchpoints.length;
        return touchpoints.map((tp) => this.toResult(tp, credit));
      }
    }
  }

  private toResult(
    tp: { channel: string; source: string | null; medium: string | null; campaign: string | null },
    credit: number,
  ): AttributionResult {
    return {
      channel: tp.channel,
      source: tp.source,
      medium: tp.medium,
      campaign: tp.campaign,
      credit: Math.round(credit * 100) / 100,
    };
  }
}

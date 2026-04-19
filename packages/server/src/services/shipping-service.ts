import { eq, sql } from 'drizzle-orm';
import { shippingZones, shippingRates } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError } from '@ecom/core';

export interface CreateZoneInput {
  name: string;
  countries?: string[];
  provinces?: string[];
}

export interface CreateRateInput {
  zoneId: string;
  name: string;
  type?: 'flat' | 'weight_based' | 'price_based';
  price: number;
  conditions?: {
    minWeight?: number;
    maxWeight?: number;
    minPrice?: number;
    maxPrice?: number;
  };
}

export class ShippingService {
  constructor(private db: Database) {}

  // -------- Zones ----------
  async listZones() {
    const zones = await this.db.query.shippingZones.findMany({
      with: { rates: true },
      orderBy: (z, { asc }) => [asc(z.name)],
    });
    return { data: zones, total: zones.length };
  }

  async getZoneById(id: string) {
    const zone = await this.db.query.shippingZones.findFirst({
      where: eq(shippingZones.id, id),
      with: { rates: true },
    });
    if (!zone) throw new NotFoundError('ShippingZone', id);
    return zone;
  }

  async createZone(input: CreateZoneInput) {
    const [zone] = await this.db
      .insert(shippingZones)
      .values({
        name: input.name,
        countries: input.countries ?? [],
        provinces: input.provinces ?? [],
      })
      .returning();
    return zone;
  }

  async updateZone(id: string, data: Partial<CreateZoneInput>) {
    await this.getZoneById(id);
    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.countries !== undefined) update.countries = data.countries;
    if (data.provinces !== undefined) update.provinces = data.provinces;

    const [updated] = await this.db
      .update(shippingZones)
      .set(update)
      .where(eq(shippingZones.id, id))
      .returning();
    return updated;
  }

  async deleteZone(id: string) {
    await this.getZoneById(id);
    await this.db.delete(shippingZones).where(eq(shippingZones.id, id));
  }

  // -------- Rates ----------
  async listRates(zoneId?: string) {
    const rates = zoneId
      ? await this.db.query.shippingRates.findMany({
          where: eq(shippingRates.zoneId, zoneId),
        })
      : await this.db.query.shippingRates.findMany();
    return { data: rates, total: rates.length };
  }

  async getRateById(id: string) {
    const rate = await this.db.query.shippingRates.findFirst({
      where: eq(shippingRates.id, id),
    });
    if (!rate) throw new NotFoundError('ShippingRate', id);
    return rate;
  }

  async createRate(input: CreateRateInput) {
    // Validate zone exists
    await this.getZoneById(input.zoneId);
    const [rate] = await this.db
      .insert(shippingRates)
      .values({
        zoneId: input.zoneId,
        name: input.name,
        type: input.type ?? 'flat',
        price: input.price,
        conditions: input.conditions ?? null,
      })
      .returning();
    return rate;
  }

  async updateRate(id: string, data: Partial<Omit<CreateRateInput, 'zoneId'>>) {
    await this.getRateById(id);
    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.type !== undefined) update.type = data.type;
    if (data.price !== undefined) update.price = data.price;
    if (data.conditions !== undefined) update.conditions = data.conditions;

    const [updated] = await this.db
      .update(shippingRates)
      .set(update)
      .where(eq(shippingRates.id, id))
      .returning();
    return updated;
  }

  async deleteRate(id: string) {
    await this.getRateById(id);
    await this.db.delete(shippingRates).where(eq(shippingRates.id, id));
  }
}

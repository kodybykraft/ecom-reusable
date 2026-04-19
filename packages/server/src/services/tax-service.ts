import { eq } from 'drizzle-orm';
import { taxRates } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError } from '@ecom/core';

export interface CreateTaxRateInput {
  name: string;
  rate: number; // decimal, e.g. 0.20 for 20% VAT
  country: string;
  province?: string | null;
  priority?: number;
  isCompound?: boolean;
  isShipping?: boolean;
}

export class TaxService {
  constructor(private db: Database) {}

  async list() {
    const rates = await this.db.query.taxRates.findMany({
      orderBy: (r, { asc }) => [asc(r.priority), asc(r.country)],
    });
    return { data: rates, total: rates.length };
  }

  async getById(id: string) {
    const rate = await this.db.query.taxRates.findFirst({
      where: eq(taxRates.id, id),
    });
    if (!rate) throw new NotFoundError('TaxRate', id);
    return rate;
  }

  async create(input: CreateTaxRateInput) {
    const [rate] = await this.db
      .insert(taxRates)
      .values({
        name: input.name,
        rate: String(input.rate),
        country: input.country,
        province: input.province ?? null,
        priority: input.priority ?? 0,
        isCompound: input.isCompound ?? false,
        isShipping: input.isShipping ?? false,
      })
      .returning();
    return rate;
  }

  async update(id: string, data: Partial<CreateTaxRateInput>) {
    await this.getById(id);
    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.rate !== undefined) update.rate = String(data.rate);
    if (data.country !== undefined) update.country = data.country;
    if (data.province !== undefined) update.province = data.province;
    if (data.priority !== undefined) update.priority = data.priority;
    if (data.isCompound !== undefined) update.isCompound = data.isCompound;
    if (data.isShipping !== undefined) update.isShipping = data.isShipping;

    const [updated] = await this.db
      .update(taxRates)
      .set(update)
      .where(eq(taxRates.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await this.getById(id);
    await this.db.delete(taxRates).where(eq(taxRates.id, id));
  }
}

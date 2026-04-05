import { eq, sql, desc, and, lte } from 'drizzle-orm';
import { inventoryLocations, inventoryLevels, inventoryAdjustments, productVariants } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError, ValidationError } from '@ecom/core';
import type { PaginationInput } from '@ecom/core';

export class InventoryService {
  constructor(private db: Database) {}

  async listLocations(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db.query.inventoryLocations.findMany({
        limit: pageSize,
        offset,
        orderBy: desc(inventoryLocations.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(inventoryLocations),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async createLocation(input: { name: string; address?: unknown; isDefault?: boolean }) {
    const [location] = await this.db
      .insert(inventoryLocations)
      .values({
        name: input.name,
        address: input.address,
        isDefault: input.isDefault ?? false,
      })
      .returning();
    return location;
  }

  async updateLocation(id: string, data: Partial<{ name: string; address: unknown; isDefault: boolean; isActive: boolean }>) {
    const existing = await this.db.query.inventoryLocations.findFirst({
      where: eq(inventoryLocations.id, id),
    });
    if (!existing) throw new NotFoundError('InventoryLocation', id);

    const [updated] = await this.db
      .update(inventoryLocations)
      .set(data)
      .where(eq(inventoryLocations.id, id))
      .returning();
    return updated;
  }

  async getLevels(
    filter?: { locationId?: string; variantId?: string; lowStockThreshold?: number },
    pagination?: PaginationInput,
  ) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (filter?.locationId) conditions.push(eq(inventoryLevels.locationId, filter.locationId));
    if (filter?.variantId) conditions.push(eq(inventoryLevels.variantId, filter.variantId));
    if (filter?.lowStockThreshold !== undefined) conditions.push(lte(inventoryLevels.available, filter.lowStockThreshold));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.inventoryLevels.findMany({
        where,
        with: { variant: true },
        limit: pageSize,
        offset,
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(inventoryLevels).where(where),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async adjustStock(input: {
    locationId: string;
    variantId: string;
    quantityChange: number;
    reason: string;
    referenceType?: string;
    referenceId?: string;
    note?: string;
    userId?: string;
  }) {
    if (input.quantityChange === 0) throw new ValidationError('quantityChange must not be zero');

    // Insert adjustment record
    await this.db.insert(inventoryAdjustments).values({
      locationId: input.locationId,
      variantId: input.variantId,
      quantityChange: input.quantityChange,
      reason: input.reason,
      referenceType: input.referenceType ?? 'manual',
      referenceId: input.referenceId,
      note: input.note,
      userId: input.userId,
    });

    // Upsert inventory level with atomic increment
    const existing = await this.db.query.inventoryLevels.findFirst({
      where: and(
        eq(inventoryLevels.locationId, input.locationId),
        eq(inventoryLevels.variantId, input.variantId),
      ),
    });

    if (existing) {
      await this.db
        .update(inventoryLevels)
        .set({ available: sql`${inventoryLevels.available} + ${input.quantityChange}` })
        .where(eq(inventoryLevels.id, existing.id));
    } else {
      await this.db.insert(inventoryLevels).values({
        locationId: input.locationId,
        variantId: input.variantId,
        available: Math.max(input.quantityChange, 0),
      });
    }
  }

  async transferStock(input: {
    fromLocationId: string;
    toLocationId: string;
    variantId: string;
    quantity: number;
    userId?: string;
    note?: string;
  }) {
    if (input.quantity <= 0) throw new ValidationError('Transfer quantity must be positive');

    // Create transfer_out adjustment
    await this.adjustStock({
      locationId: input.fromLocationId,
      variantId: input.variantId,
      quantityChange: -input.quantity,
      reason: 'transfer_out',
      referenceType: 'transfer',
      note: input.note,
      userId: input.userId,
    });

    // Create transfer_in adjustment
    await this.adjustStock({
      locationId: input.toLocationId,
      variantId: input.variantId,
      quantityChange: input.quantity,
      reason: 'transfer_in',
      referenceType: 'transfer',
      note: input.note,
      userId: input.userId,
    });
  }

  async getAdjustmentHistory(
    filter?: { locationId?: string; variantId?: string },
    pagination?: PaginationInput,
  ) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (filter?.locationId) conditions.push(eq(inventoryAdjustments.locationId, filter.locationId));
    if (filter?.variantId) conditions.push(eq(inventoryAdjustments.variantId, filter.variantId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.inventoryAdjustments.findMany({
        where,
        with: { variant: true },
        limit: pageSize,
        offset,
        orderBy: desc(inventoryAdjustments.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(inventoryAdjustments).where(where),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}

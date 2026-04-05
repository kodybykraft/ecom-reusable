import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productVariants } from './products.js';
import { users } from './users.js';

export const inventoryLocations = pgTable(
  'inventory_locations',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar('name', { length: 255 }).notNull(),
    address: jsonb('address'),
    isActive: boolean('is_active').notNull().default(true),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
);

export const inventoryLevels = pgTable(
  'inventory_levels',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    locationId: text('location_id')
      .notNull()
      .references(() => inventoryLocations.id, { onDelete: 'cascade' }),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id),
    available: integer('available').notNull().default(0),
    committed: integer('committed').notNull().default(0),
    incoming: integer('incoming').notNull().default(0),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    unique('inventory_level_unique').on(table.locationId, table.variantId),
    index('inventory_levels_variant_id_idx').on(table.variantId),
  ],
);

export const inventoryAdjustments = pgTable(
  'inventory_adjustments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    locationId: text('location_id')
      .notNull()
      .references(() => inventoryLocations.id),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id),
    quantityChange: integer('quantity_change').notNull(),
    reason: varchar('reason', { length: 30 }).notNull(), // received, returned, damaged, correction, transfer_in, transfer_out
    referenceType: varchar('reference_type', { length: 30 }).notNull(), // order, return, transfer, manual
    referenceId: text('reference_id'),
    note: text('note'),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('inventory_adjustments_variant_id_idx').on(table.variantId),
    index('inventory_adjustments_created_at_idx').on(table.createdAt),
  ],
);

// Relations
export const inventoryLocationsRelations = relations(inventoryLocations, ({ many }) => ({
  levels: many(inventoryLevels),
  adjustments: many(inventoryAdjustments),
}));

export const inventoryLevelsRelations = relations(inventoryLevels, ({ one }) => ({
  location: one(inventoryLocations, {
    fields: [inventoryLevels.locationId],
    references: [inventoryLocations.id],
  }),
  variant: one(productVariants, {
    fields: [inventoryLevels.variantId],
    references: [productVariants.id],
  }),
}));

export const inventoryAdjustmentsRelations = relations(inventoryAdjustments, ({ one }) => ({
  location: one(inventoryLocations, {
    fields: [inventoryAdjustments.locationId],
    references: [inventoryLocations.id],
  }),
  variant: one(productVariants, {
    fields: [inventoryAdjustments.variantId],
    references: [productVariants.id],
  }),
  user: one(users, {
    fields: [inventoryAdjustments.userId],
    references: [users.id],
  }),
}));

import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orders } from './orders.js';
import { customers } from './customers.js';

export const discounts = pgTable(
  'discounts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    code: varchar('code', { length: 50 }).notNull().unique(),
    type: varchar('type', { length: 20 }).notNull(), // percentage, fixed_amount, free_shipping
    value: integer('value').notNull(), // percentage (0-100) or cents
    minPurchaseAmount: integer('min_purchase_amount'),
    minQuantity: integer('min_quantity'),
    usageLimit: integer('usage_limit'),
    usageCount: integer('usage_count').notNull().default(0),
    appliesTo: jsonb('applies_to')
      .$type<{ type: 'all' | 'products' | 'collections'; productIds?: string[]; collectionIds?: string[] }>()
      .notNull()
      .default({ type: 'all' }),
    startsAt: timestamp('starts_at').notNull().defaultNow(),
    endsAt: timestamp('ends_at'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('discounts_code_idx').on(table.code),
    index('discounts_is_active_idx').on(table.isActive),
  ],
);

export const discountUsages = pgTable(
  'discount_usages',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    discountId: text('discount_id')
      .notNull()
      .references(() => discounts.id, { onDelete: 'cascade' }),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('discount_usages_discount_id_idx').on(table.discountId),
    unique('discount_usage_unique').on(table.discountId, table.orderId),
  ],
);

// Relations
export const discountsRelations = relations(discounts, ({ many }) => ({
  usages: many(discountUsages),
}));

export const discountUsagesRelations = relations(discountUsages, ({ one }) => ({
  discount: one(discounts, {
    fields: [discountUsages.discountId],
    references: [discounts.id],
  }),
  order: one(orders, {
    fields: [discountUsages.orderId],
    references: [orders.id],
  }),
  customer: one(customers, {
    fields: [discountUsages.customerId],
    references: [customers.id],
  }),
}));

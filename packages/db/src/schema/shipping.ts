import { pgTable, text, varchar, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const shippingZones = pgTable('ecom_shipping_zones', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  countries: jsonb('countries').$type<string[]>().notNull().default([]),
  provinces: jsonb('provinces').$type<string[]>().notNull().default([]),
});

export const shippingRates = pgTable('ecom_shipping_rates', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  zoneId: text('zone_id')
    .notNull()
    .references(() => shippingZones.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull().default('flat'), // flat, weight_based, price_based
  price: integer('price').notNull(), // cents
  conditions: jsonb('conditions').$type<{
    minWeight?: number;
    maxWeight?: number;
    minPrice?: number;
    maxPrice?: number;
  }>(),
}, (table) => [index('ecom_shipping_rates_zone_id_idx').on(table.zoneId)]);

// Relations
export const shippingZonesRelations = relations(shippingZones, ({ many }) => ({
  rates: many(shippingRates),
}));

export const shippingRatesRelations = relations(shippingRates, ({ one }) => ({
  zone: one(shippingZones, {
    fields: [shippingRates.zoneId],
    references: [shippingZones.id],
  }),
}));

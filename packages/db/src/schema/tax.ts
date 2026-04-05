import { pgTable, text, varchar, integer, numeric, boolean, index } from 'drizzle-orm/pg-core';

export const taxRates = pgTable(
  'tax_rates',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar('name', { length: 255 }).notNull(),
    rate: numeric('rate', { precision: 8, scale: 6 }).notNull(), // e.g. 0.080000 for 8%
    country: varchar('country', { length: 5 }).notNull(),
    province: varchar('province', { length: 10 }),
    priority: integer('priority').notNull().default(0),
    isCompound: boolean('is_compound').notNull().default(false),
    isShipping: boolean('is_shipping').notNull().default(false),
  },
  (table) => [
    index('tax_rates_country_idx').on(table.country),
  ],
);

import { pgTable, text, varchar, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const customers = pgTable(
  'ecom_customers',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar('email', { length: 255 }).notNull().unique(),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    phone: varchar('phone', { length: 50 }),
    acceptsMarketing: boolean('accepts_marketing').notNull().default(false),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('ecom_customers_email_idx').on(table.email),
  ],
);

export const customerAddresses = pgTable(
  'ecom_customer_addresses',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    company: varchar('company', { length: 200 }),
    address1: varchar('address1', { length: 255 }).notNull(),
    address2: varchar('address2', { length: 255 }),
    city: varchar('city', { length: 100 }).notNull(),
    province: varchar('province', { length: 100 }),
    provinceCode: varchar('province_code', { length: 10 }),
    country: varchar('country', { length: 100 }).notNull(),
    countryCode: varchar('country_code', { length: 5 }).notNull(),
    zip: varchar('zip', { length: 20 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    isDefault: boolean('is_default').notNull().default(false),
  },
  (table) => [
    index('ecom_addresses_customer_id_idx').on(table.customerId),
  ],
);

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(customerAddresses),
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  customer: one(customers, {
    fields: [customerAddresses.customerId],
    references: [customers.id],
  }),
}));

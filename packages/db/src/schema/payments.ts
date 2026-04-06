import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { customers } from './customers.js';
import { orders } from './orders.js';

export const paymentMethods = pgTable(
  'ecom_payment_methods',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    provider: varchar('provider', { length: 30 }).notNull(), // stripe, paypal
    providerCustomerId: text('provider_customer_id').notNull(),
    providerPaymentMethodId: text('provider_payment_method_id').notNull(),
    type: varchar('type', { length: 20 }).notNull(), // card, paypal
    last4: varchar('last4', { length: 4 }),
    brand: varchar('brand', { length: 30 }),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('ecom_payment_methods_customer_id_idx').on(table.customerId)],
);

export const paymentIntents = pgTable(
  'ecom_payment_intents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id').references(() => orders.id, { onDelete: 'set null' }),
    provider: varchar('provider', { length: 30 }).notNull(),
    providerIntentId: text('provider_intent_id').notNull(),
    amount: integer('amount').notNull(), // cents
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    status: varchar('status', { length: 30 }).notNull().default('requires_payment'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('ecom_payment_intents_order_id_idx').on(table.orderId),
    index('ecom_payment_intents_provider_intent_idx').on(table.providerIntentId),
  ],
);

// Relations
export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  customer: one(customers, { fields: [paymentMethods.customerId], references: [customers.id] }),
}));

export const paymentIntentsRelations = relations(paymentIntents, ({ one }) => ({
  order: one(orders, { fields: [paymentIntents.orderId], references: [orders.id] }),
}));

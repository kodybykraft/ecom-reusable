import { pgTable, text, varchar, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { carts } from './carts.js';
import { customers } from './customers.js';

export const checkouts = pgTable(
  'checkouts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cartId: text('cart_id')
      .notNull()
      .references(() => carts.id),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    email: varchar('email', { length: 255 }).notNull(),
    shippingAddress: jsonb('shipping_address'),
    billingAddress: jsonb('billing_address'),
    shippingMethodId: text('shipping_method_id'),
    subtotal: integer('subtotal').notNull().default(0),
    shippingTotal: integer('shipping_total').notNull().default(0),
    taxTotal: integer('tax_total').notNull().default(0),
    discountTotal: integer('discount_total').notNull().default(0),
    total: integer('total').notNull().default(0),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('checkouts_cart_id_idx').on(table.cartId),
    index('checkouts_customer_id_idx').on(table.customerId),
    index('checkouts_status_idx').on(table.status),
  ],
);

// Relations
export const checkoutsRelations = relations(checkouts, ({ one }) => ({
  cart: one(carts, {
    fields: [checkouts.cartId],
    references: [carts.id],
  }),
  customer: one(customers, {
    fields: [checkouts.customerId],
    references: [customers.id],
  }),
}));

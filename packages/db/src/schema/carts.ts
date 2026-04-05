import { pgTable, text, varchar, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { customers } from './customers.js';
import { productVariants } from './products.js';

export const carts = pgTable(
  'carts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    email: varchar('email', { length: 255 }),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    status: varchar('status', { length: 20 }).notNull().default('active'),
    metadata: jsonb('metadata'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('carts_customer_id_idx').on(table.customerId),
    index('carts_status_idx').on(table.status),
  ],
);

export const cartItems = pgTable(
  'cart_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cartId: text('cart_id')
      .notNull()
      .references(() => carts.id, { onDelete: 'cascade' }),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id),
    quantity: integer('quantity').notNull().default(1),
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('cart_items_cart_id_idx').on(table.cartId),
  ],
);

// Relations
export const cartsRelations = relations(carts, ({ one, many }) => ({
  customer: one(customers, {
    fields: [carts.customerId],
    references: [customers.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

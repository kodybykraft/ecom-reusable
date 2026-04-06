import { pgTable, text, varchar, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { customers } from './customers.js';
import { orders } from './orders.js';
import { productVariants } from './products.js';
import { users } from './users.js';

export const draftOrders = pgTable(
  'ecom_draft_orders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    email: varchar('email', { length: 255 }),
    shippingAddress: jsonb('shipping_address'),
    billingAddress: jsonb('billing_address'),
    subtotal: integer('subtotal').notNull().default(0),
    shippingTotal: integer('shipping_total').notNull().default(0),
    taxTotal: integer('tax_total').notNull().default(0),
    discountTotal: integer('discount_total').notNull().default(0),
    total: integer('total').notNull().default(0),
    discountCode: varchar('discount_code', { length: 50 }),
    notes: text('notes'),
    status: varchar('status', { length: 20 }).notNull().default('open'), // open, invoice_sent, completed
    completedOrderId: text('completed_order_id').references(() => orders.id, { onDelete: 'set null' }),
    createdBy: text('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index('ecom_draft_orders_status_idx').on(table.status),
  ],
);

export const draftOrderLineItems = pgTable(
  'ecom_draft_order_line_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    draftOrderId: text('draft_order_id')
      .notNull()
      .references(() => draftOrders.id, { onDelete: 'cascade' }),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id),
    title: varchar('title', { length: 255 }).notNull(),
    variantTitle: varchar('variant_title', { length: 255 }).notNull(),
    sku: varchar('sku', { length: 100 }),
    quantity: integer('quantity').notNull(),
    price: integer('price').notNull(),
    discount: jsonb('discount'),
  },
  (table) => [
    index('ecom_draft_order_line_items_draft_order_id_idx').on(table.draftOrderId),
  ],
);

// Relations
export const draftOrdersRelations = relations(draftOrders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [draftOrders.customerId],
    references: [customers.id],
  }),
  completedOrder: one(orders, {
    fields: [draftOrders.completedOrderId],
    references: [orders.id],
  }),
  creator: one(users, {
    fields: [draftOrders.createdBy],
    references: [users.id],
  }),
  lineItems: many(draftOrderLineItems),
}));

export const draftOrderLineItemsRelations = relations(draftOrderLineItems, ({ one }) => ({
  draftOrder: one(draftOrders, {
    fields: [draftOrderLineItems.draftOrderId],
    references: [draftOrders.id],
  }),
  variant: one(productVariants, {
    fields: [draftOrderLineItems.variantId],
    references: [productVariants.id],
  }),
}));

import { pgTable, text, varchar, integer, jsonb, timestamp, serial, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { customers } from './customers.js';
import { checkouts } from './checkouts.js';
import { productVariants } from './products.js';

export const orders = pgTable(
  'ecom_orders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderNumber: serial('order_number').notNull().unique(),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    checkoutId: text('checkout_id').references(() => checkouts.id),
    email: varchar('email', { length: 255 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    subtotal: integer('subtotal').notNull(),
    shippingTotal: integer('shipping_total').notNull().default(0),
    taxTotal: integer('tax_total').notNull().default(0),
    discountTotal: integer('discount_total').notNull().default(0),
    total: integer('total').notNull(),
    financialStatus: varchar('financial_status', { length: 30 }).notNull().default('pending'),
    fulfillmentStatus: varchar('fulfillment_status', { length: 30 }).notNull().default('unfulfilled'),
    shippingAddress: jsonb('shipping_address'),
    billingAddress: jsonb('billing_address'),
    cancelledAt: timestamp('cancelled_at'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('ecom_orders_customer_id_idx').on(table.customerId),
    index('ecom_orders_financial_status_idx').on(table.financialStatus),
    index('ecom_orders_fulfillment_status_idx').on(table.fulfillmentStatus),
    index('ecom_orders_created_at_idx').on(table.createdAt),
  ],
);

export const orderLineItems = pgTable(
  'ecom_order_line_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id),
    title: varchar('title', { length: 255 }).notNull(),
    variantTitle: varchar('variant_title', { length: 255 }).notNull(),
    sku: varchar('sku', { length: 100 }),
    quantity: integer('quantity').notNull(),
    price: integer('price').notNull(), // cents per unit
    totalDiscount: integer('total_discount').notNull().default(0),
    taxLines: jsonb('tax_lines').$type<Array<{ title: string; rate: number; amount: number }>>().default([]),
  },
  (table) => [
    index('ecom_line_items_order_id_idx').on(table.orderId),
  ],
);

export const orderTransactions = pgTable(
  'ecom_order_transactions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    kind: varchar('kind', { length: 20 }).notNull(), // sale, refund, capture, void
    status: varchar('status', { length: 20 }).notNull(), // success, failure, pending
    amount: integer('amount').notNull(), // cents
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    gateway: varchar('gateway', { length: 50 }).notNull(),
    gatewayTransactionId: text('gateway_transaction_id'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('ecom_transactions_order_id_idx').on(table.orderId),
  ],
);

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  checkout: one(checkouts, {
    fields: [orders.checkoutId],
    references: [checkouts.id],
  }),
  lineItems: many(orderLineItems),
  transactions: many(orderTransactions),
}));

export const orderLineItemsRelations = relations(orderLineItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderLineItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderLineItems.variantId],
    references: [productVariants.id],
  }),
}));

export const orderTransactionsRelations = relations(orderTransactions, ({ one }) => ({
  order: one(orders, {
    fields: [orderTransactions.orderId],
    references: [orders.id],
  }),
}));

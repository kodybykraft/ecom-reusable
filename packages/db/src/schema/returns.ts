import { pgTable, text, varchar, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orders, orderLineItems } from './orders.js';
import { customers } from './customers.js';
import { users } from './users.js';

export const returnReasons = pgTable(
  'ecom_return_reasons',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    label: varchar('label', { length: 100 }).notNull(),
    description: text('description'),
    requiresNote: boolean('requires_note').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    position: integer('position').notNull().default(0),
  },
);

export const returns = pgTable(
  'ecom_returns',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    status: varchar('status', { length: 20 }).notNull().default('requested'), // requested, approved, received, refunded, restocked, rejected
    totalRefund: integer('total_refund').notNull().default(0),
    refundMethod: varchar('refund_method', { length: 20 }).notNull(), // original_payment, store_credit
    trackingNumber: varchar('tracking_number', { length: 100 }),
    notes: text('notes'),
    processedBy: text('processed_by').references(() => users.id, { onDelete: 'set null' }),
    requestedAt: timestamp('requested_at').notNull().defaultNow(),
    approvedAt: timestamp('approved_at'),
    receivedAt: timestamp('received_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('ecom_returns_order_id_idx').on(table.orderId),
    index('ecom_returns_status_idx').on(table.status),
    index('ecom_returns_created_at_idx').on(table.createdAt),
  ],
);

export const returnLineItems = pgTable(
  'ecom_return_line_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    returnId: text('return_id')
      .notNull()
      .references(() => returns.id, { onDelete: 'cascade' }),
    orderLineItemId: text('order_line_item_id')
      .notNull()
      .references(() => orderLineItems.id),
    quantity: integer('quantity').notNull(),
    reasonId: text('reason_id')
      .notNull()
      .references(() => returnReasons.id),
    condition: varchar('condition', { length: 20 }).notNull(), // new, opened, damaged
    note: text('note'),
    restock: boolean('restock').notNull().default(true),
  },
  (table) => [
    index('ecom_return_line_items_return_id_idx').on(table.returnId),
  ],
);

// Relations
export const returnReasonsRelations = relations(returnReasons, ({ many }) => ({
  lineItems: many(returnLineItems),
}));

export const returnsRelations = relations(returns, ({ one, many }) => ({
  order: one(orders, {
    fields: [returns.orderId],
    references: [orders.id],
  }),
  customer: one(customers, {
    fields: [returns.customerId],
    references: [customers.id],
  }),
  processor: one(users, {
    fields: [returns.processedBy],
    references: [users.id],
  }),
  lineItems: many(returnLineItems),
}));

export const returnLineItemsRelations = relations(returnLineItems, ({ one }) => ({
  return: one(returns, {
    fields: [returnLineItems.returnId],
    references: [returns.id],
  }),
  orderLineItem: one(orderLineItems, {
    fields: [returnLineItems.orderLineItemId],
    references: [orderLineItems.id],
  }),
  reason: one(returnReasons, {
    fields: [returnLineItems.reasonId],
    references: [returnReasons.id],
  }),
}));

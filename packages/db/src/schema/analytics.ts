import { pgTable, text, varchar, integer, numeric, jsonb, timestamp, date, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { customers } from './customers.js';
import { orders } from './orders.js';

export const analyticsEvents = pgTable(
  'ecom_analytics_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    eventName: varchar('event_name', { length: 100 }).notNull(),
    sessionId: text('session_id').notNull(),
    visitorId: text('visitor_id').notNull(),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    properties: jsonb('properties'),
    pageUrl: text('page_url'),
    referrer: text('referrer'),
    userAgent: text('user_agent'),
    ipAddress: varchar('ip_address', { length: 45 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('ecom_events_event_name_idx').on(table.eventName),
    index('ecom_events_session_id_idx').on(table.sessionId),
    index('ecom_events_visitor_id_idx').on(table.visitorId),
    index('ecom_events_created_at_idx').on(table.createdAt),
  ],
);

export const analyticsSessions = pgTable(
  'ecom_analytics_sessions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    visitorId: text('visitor_id').notNull(),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    landingPage: text('landing_page'),
    referrer: text('referrer'),
    utmSource: varchar('utm_source', { length: 100 }),
    utmMedium: varchar('utm_medium', { length: 100 }),
    utmCampaign: varchar('utm_campaign', { length: 255 }),
    utmTerm: varchar('utm_term', { length: 255 }),
    utmContent: varchar('utm_content', { length: 255 }),
    deviceType: varchar('device_type', { length: 20 }),
    browser: varchar('browser', { length: 50 }),
    os: varchar('os', { length: 50 }),
    country: varchar('country', { length: 5 }),
    city: varchar('city', { length: 100 }),
    startedAt: timestamp('started_at').notNull().defaultNow(),
    endedAt: timestamp('ended_at'),
    pageCount: integer('page_count').notNull().default(0),
    eventsCount: integer('events_count').notNull().default(0),
  },
  (table) => [
    index('ecom_sessions_visitor_id_idx').on(table.visitorId),
    index('ecom_sessions_started_at_idx').on(table.startedAt),
  ],
);

export const analyticsDailyAggregates = pgTable(
  'ecom_analytics_daily_aggregates',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    date: date('date').notNull(),
    metricKey: varchar('metric_key', { length: 100 }).notNull(), // e.g. "revenue.total", "orders.count"
    dimensions: jsonb('dimensions'), // e.g. { channel: "organic", productId: "..." }
    value: numeric('value', { precision: 20, scale: 4 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('ecom_aggregates_date_metric_idx').on(table.date, table.metricKey),
  ],
);

export const attributionTouchpoints = pgTable(
  'ecom_attribution_touchpoints',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    visitorId: text('visitor_id').notNull(),
    customerId: text('customer_id').references(() => customers.id, { onDelete: 'set null' }),
    orderId: text('order_id').references(() => orders.id, { onDelete: 'set null' }),
    channel: varchar('channel', { length: 50 }).notNull(),
    source: varchar('source', { length: 100 }),
    medium: varchar('medium', { length: 100 }),
    campaign: varchar('campaign', { length: 255 }),
    touchpointUrl: text('touchpoint_url'),
    touchedAt: timestamp('touched_at').notNull().defaultNow(),
  },
  (table) => [
    index('ecom_touchpoints_visitor_id_idx').on(table.visitorId),
    index('ecom_touchpoints_order_id_idx').on(table.orderId),
  ],
);

// Relations
export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  customer: one(customers, { fields: [analyticsEvents.customerId], references: [customers.id] }),
}));

export const analyticsSessionsRelations = relations(analyticsSessions, ({ one }) => ({
  customer: one(customers, { fields: [analyticsSessions.customerId], references: [customers.id] }),
}));

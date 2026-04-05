import { pgTable, text, varchar, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';

export const importJobs = pgTable(
  'import_jobs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: varchar('type', { length: 30 }).notNull(), // products, customers, orders, inventory
    status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, completed, failed
    fileName: varchar('file_name', { length: 500 }).notNull(),
    totalRows: integer('total_rows').notNull().default(0),
    processedRows: integer('processed_rows').notNull().default(0),
    successCount: integer('success_count').notNull().default(0),
    errorCount: integer('error_count').notNull().default(0),
    errors: jsonb('errors'),
    columnMapping: jsonb('column_mapping'),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('import_jobs_status_idx').on(table.status),
  ],
);

export const exportJobs = pgTable(
  'export_jobs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: varchar('type', { length: 30 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, completed, failed
    filters: jsonb('filters'),
    fileName: varchar('file_name', { length: 500 }),
    totalRows: integer('total_rows').notNull().default(0),
    fileUrl: text('file_url'),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('export_jobs_status_idx').on(table.status),
  ],
);

// Relations
export const importJobsRelations = relations(importJobs, ({ one }) => ({
  user: one(users, {
    fields: [importJobs.userId],
    references: [users.id],
  }),
}));

export const exportJobsRelations = relations(exportJobs, ({ one }) => ({
  user: one(users, {
    fields: [exportJobs.userId],
    references: [users.id],
  }),
}));

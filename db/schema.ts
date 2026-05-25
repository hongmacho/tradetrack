import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull().default(''),
  notes: text('notes').default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: text('customer_id')
    .notNull()
    .references(() => customers.id),
  title: text('title').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull().default('scheduled'),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  notes: text('notes').default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const jobPhotos = sqliteTable('job_photos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  jobId: text('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption').default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  jobId: text('job_id')
    .notNull()
    .references(() => jobs.id),
  amount: integer('amount').notNull().default(0),
  items: text('items', { mode: 'json' }).$type<import('@/types').InvoiceItem[]>().notNull().default([]),
  issuedAt: integer('issued_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
})

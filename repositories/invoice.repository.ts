import { eq, desc, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { invoices, jobs, customers } from '@/db/schema'
import type { Invoice, NewInvoice, InvoiceWithJob, InvoiceItem } from '@/types'

export const invoiceRepository = {
  findAll: (): Invoice[] =>
    db.select().from(invoices).orderBy(desc(invoices.issuedAt)).all(),

  findAllWithJob: (): InvoiceWithJob[] => {
    const rows = db
      .select({ invoice: invoices, job: jobs, customer: customers })
      .from(invoices)
      .innerJoin(jobs, eq(invoices.jobId, jobs.id))
      .innerJoin(customers, eq(jobs.customerId, customers.id))
      .orderBy(desc(invoices.issuedAt))
      .all()
    return rows.map(({ invoice, job, customer }) => ({ ...invoice, job: { ...job, customer } }))
  },

  findById: (id: string): Invoice | undefined =>
    db.select().from(invoices).where(eq(invoices.id, id)).get(),

  findWithJob: (id: string): InvoiceWithJob | undefined => {
    const row = db
      .select({ invoice: invoices, job: jobs, customer: customers })
      .from(invoices)
      .innerJoin(jobs, eq(invoices.jobId, jobs.id))
      .innerJoin(customers, eq(jobs.customerId, customers.id))
      .where(eq(invoices.id, id))
      .get()
    if (!row) return undefined
    return { ...row.invoice, job: { ...row.job, customer: row.customer } }
  },

  findUnpaid: (): InvoiceWithJob[] =>
    invoiceRepository.findAllWithJob().filter((inv) => inv.paidAt === null),

  create: (data: { jobId: string; items: InvoiceItem[] }): Invoice => {
    const amount = data.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
    const [row] = db
      .insert(invoices)
      .values({ jobId: data.jobId, items: data.items, amount })
      .returning()
      .all()
    return row
  },

  markPaid: (id: string): Invoice | undefined => {
    const [row] = db
      .update(invoices)
      .set({ paidAt: new Date() })
      .where(eq(invoices.id, id))
      .returning()
      .all()
    return row
  },

  delete: (id: string): void => {
    db.delete(invoices).where(eq(invoices.id, id)).run()
  },
}

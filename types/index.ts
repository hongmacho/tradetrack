import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import type { customers, jobs, jobPhotos, invoices } from '@/db/schema'

export type Customer = InferSelectModel<typeof customers>
export type NewCustomer = InferInsertModel<typeof customers>

export type Job = InferSelectModel<typeof jobs>
export type NewJob = InferInsertModel<typeof jobs>

export type JobPhoto = InferSelectModel<typeof jobPhotos>
export type NewJobPhoto = InferInsertModel<typeof jobPhotos>

export type Invoice = InferSelectModel<typeof invoices>
export type NewInvoice = InferInsertModel<typeof invoices>

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type JobType = 'hvac' | 'plumbing' | 'electrical' | 'other'

export interface InvoiceItem {
  label: string
  qty: number
  unitPrice: number
}

export interface JobWithCustomer extends Job {
  customer: Customer
}

export interface InvoiceWithJob extends Invoice {
  job: JobWithCustomer
}

export interface CustomerWithJobs extends Customer {
  jobs: Job[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string | Record<string, unknown>
}

export interface DashboardStats {
  todayJobs: number
  thisWeekJobs: number
  unpaidCount: number
  unpaidAmount: number
  completedThisMonth: number
}

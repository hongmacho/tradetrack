import { eq, desc, and, gte, lt } from 'drizzle-orm'
import { db } from '@/db'
import { jobs, customers, jobPhotos } from '@/db/schema'
import type { Job, NewJob, JobWithCustomer, JobStatus, JobPhoto } from '@/types'

const VALID_STATUS_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  scheduled: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export const jobRepository = {
  findAll: (): Job[] =>
    db.select().from(jobs).orderBy(desc(jobs.scheduledAt)).all(),

  findToday: (): JobWithCustomer[] => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const rows = db
      .select({ job: jobs, customer: customers })
      .from(jobs)
      .innerJoin(customers, eq(jobs.customerId, customers.id))
      .where(and(gte(jobs.scheduledAt, start), lt(jobs.scheduledAt, end)))
      .orderBy(jobs.scheduledAt)
      .all()

    return rows.map(({ job, customer }) => ({ ...job, customer }))
  },

  findThisWeek: (): JobWithCustomer[] => {
    const start = new Date()
    const day = start.getDay()
    start.setDate(start.getDate() - day)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(end.getDate() + 7)

    const rows = db
      .select({ job: jobs, customer: customers })
      .from(jobs)
      .innerJoin(customers, eq(jobs.customerId, customers.id))
      .where(and(gte(jobs.scheduledAt, start), lt(jobs.scheduledAt, end)))
      .orderBy(jobs.scheduledAt)
      .all()

    return rows.map(({ job, customer }) => ({ ...job, customer }))
  },

  findAllWithCustomer: (): JobWithCustomer[] => {
    const rows = db
      .select({ job: jobs, customer: customers })
      .from(jobs)
      .innerJoin(customers, eq(jobs.customerId, customers.id))
      .orderBy(desc(jobs.scheduledAt))
      .all()
    return rows.map(({ job, customer }) => ({ ...job, customer }))
  },

  findById: (id: string): Job | undefined =>
    db.select().from(jobs).where(eq(jobs.id, id)).get(),

  findByIdWithCustomer: (id: string): JobWithCustomer | undefined => {
    const row = db
      .select({ job: jobs, customer: customers })
      .from(jobs)
      .innerJoin(customers, eq(jobs.customerId, customers.id))
      .where(eq(jobs.id, id))
      .get()
    if (!row) return undefined
    return { ...row.job, customer: row.customer }
  },

  findPhotos: (jobId: string): JobPhoto[] =>
    db.select().from(jobPhotos).where(eq(jobPhotos.jobId, jobId)).all(),

  create: (data: Omit<NewJob, 'id' | 'createdAt'>): Job => {
    const [row] = db.insert(jobs).values(data).returning().all()
    return row
  },

  update: (id: string, data: Partial<Omit<NewJob, 'id' | 'createdAt'>>): Job | undefined => {
    const [row] = db.update(jobs).set(data).where(eq(jobs.id, id)).returning().all()
    return row
  },

  updateStatus: (id: string, newStatus: JobStatus): Job | undefined => {
    const job = jobRepository.findById(id)
    if (!job) return undefined

    const currentStatus = job.status as JobStatus
    const allowed = VALID_STATUS_TRANSITIONS[currentStatus]
    if (!allowed.includes(newStatus)) {
      throw new Error(`상태를 '${currentStatus}'에서 '${newStatus}'로 변경할 수 없습니다`)
    }

    const updates: Partial<NewJob> = { status: newStatus }
    if (newStatus === 'completed') {
      updates.completedAt = new Date()
    }

    const [row] = db.update(jobs).set(updates).where(eq(jobs.id, id)).returning().all()
    return row
  },

  addPhoto: (jobId: string, url: string, caption?: string): JobPhoto => {
    const [row] = db
      .insert(jobPhotos)
      .values({ jobId, url, caption: caption ?? '' })
      .returning()
      .all()
    return row
  },

  delete: (id: string): void => {
    db.delete(jobs).where(eq(jobs.id, id)).run()
  },
}

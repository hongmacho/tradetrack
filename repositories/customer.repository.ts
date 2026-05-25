import { eq, desc, like, or } from 'drizzle-orm'
import { db } from '@/db'
import { customers, jobs } from '@/db/schema'
import type { Customer, NewCustomer, CustomerWithJobs } from '@/types'

export const customerRepository = {
  findAll: (search?: string): Customer[] => {
    if (search) {
      return db
        .select()
        .from(customers)
        .where(
          or(
            like(customers.name, `%${search}%`),
            like(customers.phone, `%${search}%`)
          )
        )
        .orderBy(desc(customers.createdAt))
        .all()
    }
    return db.select().from(customers).orderBy(desc(customers.createdAt)).all()
  },

  findById: (id: string): Customer | undefined =>
    db.select().from(customers).where(eq(customers.id, id)).get(),

  findWithJobs: (id: string): CustomerWithJobs | undefined => {
    const customer = customerRepository.findById(id)
    if (!customer) return undefined
    const jobList = db
      .select()
      .from(jobs)
      .where(eq(jobs.customerId, id))
      .orderBy(desc(jobs.scheduledAt))
      .all()
    return { ...customer, jobs: jobList }
  },

  create: (data: Omit<NewCustomer, 'id' | 'createdAt'>): Customer => {
    const [row] = db.insert(customers).values(data).returning().all()
    return row
  },

  update: (id: string, data: Partial<Omit<NewCustomer, 'id' | 'createdAt'>>): Customer | undefined => {
    const [row] = db.update(customers).set(data).where(eq(customers.id, id)).returning().all()
    return row
  },

  delete: (id: string): void => {
    db.delete(customers).where(eq(customers.id, id)).run()
  },
}

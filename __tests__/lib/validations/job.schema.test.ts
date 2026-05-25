import { jobCreateSchema, jobUpdateSchema, jobStatusSchema } from '@/lib/validations/job.schema'

const validJob = {
  customerId: 'cust-001',
  title: '에어컨 설치',
  type: 'hvac' as const,
  scheduledAt: '2025-06-20T10:00:00',
  notes: '2층 거실',
}

describe('jobCreateSchema', () => {
  it('accepts valid input', () => {
    expect(jobCreateSchema.safeParse(validJob).success).toBe(true)
  })

  it('rejects empty customerId', () => {
    const result = jobCreateSchema.safeParse({ ...validJob, customerId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects title shorter than 2 chars', () => {
    const result = jobCreateSchema.safeParse({ ...validJob, title: '에' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid job type', () => {
    const result = jobCreateSchema.safeParse({ ...validJob, type: 'carpentry' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid job types', () => {
    for (const type of ['hvac', 'plumbing', 'electrical', 'other'] as const) {
      const result = jobCreateSchema.safeParse({ ...validJob, type })
      expect(result.success).toBe(true)
    }
  })

  it('rejects empty scheduledAt', () => {
    const result = jobCreateSchema.safeParse({ ...validJob, scheduledAt: '' })
    expect(result.success).toBe(false)
  })

  it('defaults notes to empty string', () => {
    const { notes: _n, ...withoutNotes } = validJob
    const result = jobCreateSchema.safeParse(withoutNotes)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.notes).toBe('')
  })
})

describe('jobUpdateSchema', () => {
  it('allows partial updates', () => {
    expect(jobUpdateSchema.safeParse({ title: '배관 수리' }).success).toBe(true)
  })

  it('allows empty object', () => {
    expect(jobUpdateSchema.safeParse({}).success).toBe(true)
  })

  it('still validates type on partial update', () => {
    expect(jobUpdateSchema.safeParse({ type: 'unknown' }).success).toBe(false)
  })
})

describe('jobStatusSchema', () => {
  it('accepts valid statuses', () => {
    for (const status of ['scheduled', 'in_progress', 'completed', 'cancelled'] as const) {
      expect(jobStatusSchema.safeParse({ status }).success).toBe(true)
    }
  })

  it('rejects invalid status', () => {
    expect(jobStatusSchema.safeParse({ status: 'pending' }).success).toBe(false)
  })
})

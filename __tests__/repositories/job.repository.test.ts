import { customerRepository } from '@/repositories/customer.repository'
import { jobRepository } from '@/repositories/job.repository'
import { clearDb } from '../helpers/testDb'

let customerId: string

beforeEach(() => {
  clearDb()
  const customer = customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
  customerId = customer.id
})

function makeJob(overrides?: Partial<{ title: string; type: string; scheduledAt: Date; notes: string }>) {
  return jobRepository.create({
    customerId,
    title: overrides?.title ?? '에어컨 점검',
    type: overrides?.type ?? 'hvac',
    status: 'scheduled',
    scheduledAt: overrides?.scheduledAt ?? new Date('2025-06-20T10:00:00'),
    notes: overrides?.notes ?? '',
  })
}

describe('jobRepository.create', () => {
  it('creates a job and assigns id with default status', () => {
    const job = makeJob()
    expect(job.id).toBeDefined()
    expect(job.status).toBe('scheduled')
    expect(job.customerId).toBe(customerId)
  })
})

describe('jobRepository.findAll', () => {
  it('returns empty array when no jobs', () => {
    expect(jobRepository.findAll()).toEqual([])
  })

  it('returns all jobs', () => {
    makeJob()
    makeJob({ title: '배관 수리' })
    expect(jobRepository.findAll()).toHaveLength(2)
  })
})

describe('jobRepository.findById', () => {
  it('returns job by id', () => {
    const job = makeJob()
    expect(jobRepository.findById(job.id)).toMatchObject({ title: '에어컨 점검' })
  })

  it('returns undefined for unknown id', () => {
    expect(jobRepository.findById('nonexistent')).toBeUndefined()
  })
})

describe('jobRepository.findByIdWithCustomer', () => {
  it('returns job with embedded customer', () => {
    const job = makeJob()
    const result = jobRepository.findByIdWithCustomer(job.id)
    expect(result).toBeDefined()
    expect(result?.customer.name).toBe('홍길동')
  })

  it('returns undefined for unknown id', () => {
    expect(jobRepository.findByIdWithCustomer('nonexistent')).toBeUndefined()
  })
})

describe('jobRepository.update', () => {
  it('updates title', () => {
    const job = makeJob()
    const updated = jobRepository.update(job.id, { title: '에어컨 청소' })
    expect(updated?.title).toBe('에어컨 청소')
  })

  it('returns undefined for unknown id', () => {
    expect(jobRepository.update('nonexistent', { title: 'X' })).toBeUndefined()
  })
})

describe('jobRepository.updateStatus', () => {
  it('transitions scheduled → in_progress', () => {
    const job = makeJob()
    const updated = jobRepository.updateStatus(job.id, 'in_progress')
    expect(updated?.status).toBe('in_progress')
  })

  it('transitions in_progress → completed and sets completedAt', () => {
    const job = makeJob()
    jobRepository.updateStatus(job.id, 'in_progress')
    const updated = jobRepository.updateStatus(job.id, 'completed')
    expect(updated?.status).toBe('completed')
    expect(updated?.completedAt).toBeDefined()
  })

  it('transitions scheduled → cancelled', () => {
    const job = makeJob()
    const updated = jobRepository.updateStatus(job.id, 'cancelled')
    expect(updated?.status).toBe('cancelled')
  })

  it('throws on invalid transition completed → in_progress', () => {
    const job = makeJob()
    jobRepository.updateStatus(job.id, 'in_progress')
    jobRepository.updateStatus(job.id, 'completed')
    expect(() => jobRepository.updateStatus(job.id, 'in_progress')).toThrow()
  })

  it('throws on invalid transition cancelled → scheduled', () => {
    const job = makeJob()
    jobRepository.updateStatus(job.id, 'cancelled')
    expect(() => jobRepository.updateStatus(job.id, 'scheduled')).toThrow()
  })

  it('returns undefined for unknown id', () => {
    expect(jobRepository.updateStatus('nonexistent', 'in_progress')).toBeUndefined()
  })
})

describe('jobRepository.findPhotos', () => {
  it('returns empty array when no photos', () => {
    const job = makeJob()
    expect(jobRepository.findPhotos(job.id)).toEqual([])
  })
})

describe('jobRepository.addPhoto', () => {
  it('adds a photo and returns it', () => {
    const job = makeJob()
    const photo = jobRepository.addPhoto(job.id, 'https://example.com/photo.jpg', '작업 전')
    expect(photo.id).toBeDefined()
    expect(photo.url).toBe('https://example.com/photo.jpg')
    expect(photo.caption).toBe('작업 전')
  })

  it('findPhotos returns added photos', () => {
    const job = makeJob()
    jobRepository.addPhoto(job.id, 'https://example.com/1.jpg')
    jobRepository.addPhoto(job.id, 'https://example.com/2.jpg')
    expect(jobRepository.findPhotos(job.id)).toHaveLength(2)
  })
})

describe('jobRepository.delete', () => {
  it('removes the job', () => {
    const job = makeJob()
    jobRepository.delete(job.id)
    expect(jobRepository.findById(job.id)).toBeUndefined()
  })
})

describe('jobRepository.findAllWithCustomer', () => {
  it('returns jobs with customer data', () => {
    makeJob()
    const results = jobRepository.findAllWithCustomer()
    expect(results).toHaveLength(1)
    expect(results[0].customer.name).toBe('홍길동')
  })
})

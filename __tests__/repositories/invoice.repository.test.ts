import { customerRepository } from '@/repositories/customer.repository'
import { jobRepository } from '@/repositories/job.repository'
import { invoiceRepository } from '@/repositories/invoice.repository'
import { clearDb } from '../helpers/testDb'

let jobId: string

beforeEach(() => {
  clearDb()
  const customer = customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
  const job = jobRepository.create({
    customerId: customer.id,
    title: '에어컨 점검',
    type: 'hvac',
    status: 'scheduled',
    scheduledAt: new Date('2025-06-20T10:00:00'),
    notes: '',
  })
  jobId = job.id
})

const sampleItems = [
  { label: '에어컨 필터', qty: 2, unitPrice: 15000 },
  { label: '출장비', qty: 1, unitPrice: 30000 },
]

describe('invoiceRepository.create', () => {
  it('creates invoice and calculates amount', () => {
    const invoice = invoiceRepository.create({ jobId, items: sampleItems })
    expect(invoice.id).toBeDefined()
    expect(invoice.jobId).toBe(jobId)
    expect(invoice.amount).toBe(60000) // 2*15000 + 1*30000
    expect(invoice.paidAt).toBeNull()
  })

  it('stores items correctly', () => {
    const invoice = invoiceRepository.create({ jobId, items: sampleItems })
    expect(invoice.items).toHaveLength(2)
    expect(invoice.items[0].label).toBe('에어컨 필터')
  })
})

describe('invoiceRepository.findAll', () => {
  it('returns empty array when no invoices', () => {
    expect(invoiceRepository.findAll()).toEqual([])
  })

  it('returns all invoices', () => {
    invoiceRepository.create({ jobId, items: sampleItems })
    expect(invoiceRepository.findAll()).toHaveLength(1)
  })
})

describe('invoiceRepository.findById', () => {
  it('returns invoice by id', () => {
    const inv = invoiceRepository.create({ jobId, items: sampleItems })
    const found = invoiceRepository.findById(inv.id)
    expect(found?.amount).toBe(60000)
  })

  it('returns undefined for unknown id', () => {
    expect(invoiceRepository.findById('nonexistent')).toBeUndefined()
  })
})

describe('invoiceRepository.findWithJob', () => {
  it('returns invoice with nested job and customer', () => {
    const inv = invoiceRepository.create({ jobId, items: sampleItems })
    const result = invoiceRepository.findWithJob(inv.id)
    expect(result).toBeDefined()
    expect(result?.job.title).toBe('에어컨 점검')
    expect(result?.job.customer.name).toBe('홍길동')
  })

  it('returns undefined for unknown id', () => {
    expect(invoiceRepository.findWithJob('nonexistent')).toBeUndefined()
  })
})

describe('invoiceRepository.findAllWithJob', () => {
  it('returns invoices with job and customer', () => {
    invoiceRepository.create({ jobId, items: sampleItems })
    const results = invoiceRepository.findAllWithJob()
    expect(results).toHaveLength(1)
    expect(results[0].job.customer.name).toBe('홍길동')
  })
})

describe('invoiceRepository.markPaid', () => {
  it('sets paidAt timestamp', () => {
    const inv = invoiceRepository.create({ jobId, items: sampleItems })
    const paid = invoiceRepository.markPaid(inv.id)
    expect(paid?.paidAt).toBeDefined()
    expect(paid?.paidAt).not.toBeNull()
  })
})

describe('invoiceRepository.findUnpaid', () => {
  it('returns unpaid invoices', () => {
    invoiceRepository.create({ jobId, items: sampleItems })
    expect(invoiceRepository.findUnpaid()).toHaveLength(1)
  })

  it('excludes paid invoices', () => {
    const inv = invoiceRepository.create({ jobId, items: sampleItems })
    invoiceRepository.markPaid(inv.id)
    expect(invoiceRepository.findUnpaid()).toHaveLength(0)
  })
})

describe('invoiceRepository.delete', () => {
  it('removes the invoice', () => {
    const inv = invoiceRepository.create({ jobId, items: sampleItems })
    invoiceRepository.delete(inv.id)
    expect(invoiceRepository.findById(inv.id)).toBeUndefined()
  })
})

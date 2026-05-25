import { invoiceCreateSchema, invoiceItemSchema } from '@/lib/validations/invoice.schema'

const validItem = { label: '에어컨 필터', qty: 2, unitPrice: 15000 }

describe('invoiceItemSchema', () => {
  it('accepts valid item', () => {
    expect(invoiceItemSchema.safeParse(validItem).success).toBe(true)
  })

  it('rejects empty label', () => {
    expect(invoiceItemSchema.safeParse({ ...validItem, label: '' }).success).toBe(false)
  })

  it('rejects qty less than 1', () => {
    expect(invoiceItemSchema.safeParse({ ...validItem, qty: 0 }).success).toBe(false)
  })

  it('rejects negative unitPrice', () => {
    expect(invoiceItemSchema.safeParse({ ...validItem, unitPrice: -1 }).success).toBe(false)
  })

  it('accepts zero unitPrice', () => {
    expect(invoiceItemSchema.safeParse({ ...validItem, unitPrice: 0 }).success).toBe(true)
  })
})

describe('invoiceCreateSchema', () => {
  const valid = { jobId: 'job-001', items: [validItem] }

  it('accepts valid input', () => {
    expect(invoiceCreateSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects empty jobId', () => {
    expect(invoiceCreateSchema.safeParse({ ...valid, jobId: '' }).success).toBe(false)
  })

  it('rejects empty items array', () => {
    expect(invoiceCreateSchema.safeParse({ ...valid, items: [] }).success).toBe(false)
  })

  it('accepts multiple items', () => {
    const result = invoiceCreateSchema.safeParse({
      jobId: 'job-001',
      items: [validItem, { label: '출장비', qty: 1, unitPrice: 30000 }],
    })
    expect(result.success).toBe(true)
  })

  it('rejects item with invalid qty inside array', () => {
    const result = invoiceCreateSchema.safeParse({
      ...valid,
      items: [{ label: '항목', qty: 0, unitPrice: 1000 }],
    })
    expect(result.success).toBe(false)
  })
})

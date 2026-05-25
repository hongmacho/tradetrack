import { customerCreateSchema, customerUpdateSchema } from '@/lib/validations/customer.schema'

describe('customerCreateSchema', () => {
  const valid = { name: '홍길동', phone: '01012345678', address: '서울시', notes: '메모' }

  it('accepts valid input', () => {
    expect(customerCreateSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects name shorter than 2 chars', () => {
    const result = customerCreateSchema.safeParse({ ...valid, name: '홍' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('2자')
    }
  })

  it('rejects phone shorter than 9 chars', () => {
    const result = customerCreateSchema.safeParse({ ...valid, phone: '0101234' })
    expect(result.success).toBe(false)
  })

  it('rejects phone with invalid characters', () => {
    const result = customerCreateSchema.safeParse({ ...valid, phone: '010-abc-1234' })
    expect(result.success).toBe(false)
  })

  it('accepts phone with dashes and plus', () => {
    const result = customerCreateSchema.safeParse({ ...valid, phone: '+82-10-1234-5678' })
    expect(result.success).toBe(true)
  })

  it('defaults address to empty string', () => {
    const result = customerCreateSchema.safeParse({ name: '홍길동', phone: '01012345678' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.address).toBe('')
  })

  it('defaults notes to empty string', () => {
    const result = customerCreateSchema.safeParse({ name: '홍길동', phone: '01012345678' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.notes).toBe('')
  })
})

describe('customerUpdateSchema', () => {
  it('allows partial updates', () => {
    const result = customerUpdateSchema.safeParse({ name: '김철수' })
    expect(result.success).toBe(true)
  })

  it('allows empty object', () => {
    const result = customerUpdateSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('still validates name length on partial update', () => {
    const result = customerUpdateSchema.safeParse({ name: '홍' })
    expect(result.success).toBe(false)
  })
})

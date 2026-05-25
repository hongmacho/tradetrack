import { customerRepository } from '@/repositories/customer.repository'
import { clearDb } from '../helpers/testDb'

beforeEach(() => clearDb())

describe('customerRepository.create', () => {
  it('creates a customer and assigns id', () => {
    const c = customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    expect(c.id).toBeDefined()
    expect(c.name).toBe('홍길동')
    expect(c.phone).toBe('01012345678')
  })
})

describe('customerRepository.findAll', () => {
  it('returns empty array when no customers', () => {
    expect(customerRepository.findAll()).toEqual([])
  })

  it('returns all customers ordered by createdAt desc', () => {
    customerRepository.create({ name: '김철수', phone: '01011111111', address: '', notes: '' })
    customerRepository.create({ name: '이영희', phone: '01022222222', address: '', notes: '' })
    const all = customerRepository.findAll()
    expect(all).toHaveLength(2)
  })

  it('filters by name search term', () => {
    customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    customerRepository.create({ name: '김철수', phone: '01099999999', address: '', notes: '' })
    const result = customerRepository.findAll('홍')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('홍길동')
  })

  it('filters by phone search term', () => {
    customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    customerRepository.create({ name: '김철수', phone: '01099999999', address: '', notes: '' })
    const result = customerRepository.findAll('0109')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('김철수')
  })

  it('returns empty when search term matches nothing', () => {
    customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    expect(customerRepository.findAll('ZZZZZ')).toHaveLength(0)
  })
})

describe('customerRepository.findById', () => {
  it('returns customer by id', () => {
    const c = customerRepository.create({ name: '박민수', phone: '01033333333', address: '', notes: '' })
    const found = customerRepository.findById(c.id)
    expect(found).toMatchObject({ name: '박민수' })
  })

  it('returns undefined for unknown id', () => {
    expect(customerRepository.findById('nonexistent')).toBeUndefined()
  })
})

describe('customerRepository.update', () => {
  it('updates name', () => {
    const c = customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    const updated = customerRepository.update(c.id, { name: '홍길서' })
    expect(updated?.name).toBe('홍길서')
  })

  it('updates address', () => {
    const c = customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    const updated = customerRepository.update(c.id, { address: '서울시 강남구' })
    expect(updated?.address).toBe('서울시 강남구')
  })

  it('returns undefined for unknown id', () => {
    expect(customerRepository.update('nonexistent', { name: '이름' })).toBeUndefined()
  })
})

describe('customerRepository.delete', () => {
  it('removes the customer', () => {
    const c = customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    customerRepository.delete(c.id)
    expect(customerRepository.findById(c.id)).toBeUndefined()
  })

  it('findAll returns one less after delete', () => {
    const c1 = customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    customerRepository.create({ name: '김철수', phone: '01099999999', address: '', notes: '' })
    customerRepository.delete(c1.id)
    expect(customerRepository.findAll()).toHaveLength(1)
  })
})

describe('customerRepository.findWithJobs', () => {
  it('returns customer with empty jobs array', () => {
    const c = customerRepository.create({ name: '홍길동', phone: '01012345678', address: '', notes: '' })
    const result = customerRepository.findWithJobs(c.id)
    expect(result).toBeDefined()
    expect(result?.jobs).toEqual([])
  })

  it('returns undefined for unknown id', () => {
    expect(customerRepository.findWithJobs('nonexistent')).toBeUndefined()
  })
})

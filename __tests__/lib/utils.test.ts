import { cn, formatKRW, formatDate, formatDateTime, formatPhone } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('resolves tailwind conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles undefined and empty strings', () => {
    expect(cn('foo', undefined, '', 'bar')).toBe('foo bar')
  })
})

describe('formatKRW', () => {
  it('formats positive amount with Korean currency', () => {
    const result = formatKRW(10000)
    expect(result).toContain('10,000')
  })

  it('formats zero', () => {
    const result = formatKRW(0)
    expect(result).toContain('0')
  })

  it('formats large amount', () => {
    const result = formatKRW(1000000)
    expect(result).toContain('1,000,000')
  })
})

describe('formatDate', () => {
  it('returns dash for null', () => {
    expect(formatDate(null)).toBe('-')
  })

  it('returns dash for undefined', () => {
    expect(formatDate(undefined)).toBe('-')
  })

  it('formats Date object with year', () => {
    const d = new Date('2025-01-15T00:00:00')
    expect(formatDate(d)).toContain('2025')
  })

  it('formats date string with year', () => {
    expect(formatDate('2025-06-20')).toContain('2025')
  })

  it('includes month and day', () => {
    const d = new Date('2025-03-05T00:00:00')
    const result = formatDate(d)
    expect(result).toContain('03')
    expect(result).toContain('05')
  })
})

describe('formatDateTime', () => {
  it('returns dash for null', () => {
    expect(formatDateTime(null)).toBe('-')
  })

  it('returns dash for undefined', () => {
    expect(formatDateTime(undefined)).toBe('-')
  })

  it('formats Date with year', () => {
    const d = new Date('2025-01-15T14:30:00')
    expect(formatDateTime(d)).toContain('2025')
  })

  it('formats date string', () => {
    expect(formatDateTime('2025-01-15T14:30:00')).toContain('2025')
  })
})

describe('formatPhone', () => {
  it('formats 10-digit number', () => {
    expect(formatPhone('0101234567')).toBe('010-123-4567')
  })

  it('formats 11-digit number with 4-digit middle', () => {
    expect(formatPhone('01012345678')).toBe('010-1234-5678')
  })

  it('returns unmatched string as-is', () => {
    expect(formatPhone('123')).toBe('123')
  })
})

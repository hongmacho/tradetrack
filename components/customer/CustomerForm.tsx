'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Customer } from '@/types'

interface CustomerFormProps {
  initial?: Partial<Customer>
  onSubmit: (data: { name: string; phone: string; address: string; notes: string }) => Promise<void>
  submitLabel?: string
}

export function CustomerForm({ initial = {}, onSubmit, submitLabel = '저장' }: CustomerFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initial.name ?? '')
  const [phone, setPhone] = useState(initial.phone ?? '')
  const [address, setAddress] = useState(initial.address ?? '')
  const [notes, setNotes] = useState(initial.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit({ name, phone, address, notes })
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="홍길동"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          연락처 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="010-0000-0000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">주소</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="서울시 강남구 ..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">메모</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="고객 특이사항..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

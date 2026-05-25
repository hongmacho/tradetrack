'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Customer, JobType } from '@/types'

const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: 'hvac', label: '에어컨·냉난방' },
  { value: 'plumbing', label: '배관' },
  { value: 'electrical', label: '전기' },
  { value: 'other', label: '기타' },
]

interface JobFormData {
  customerId: string
  title: string
  type: JobType
  scheduledAt: string
  notes: string
}

interface JobFormProps {
  customers: Customer[]
  initial?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => Promise<void>
  submitLabel?: string
}

export function JobForm({ customers, initial = {}, onSubmit, submitLabel = '저장' }: JobFormProps) {
  const router = useRouter()
  const [customerId, setCustomerId] = useState(initial.customerId ?? '')
  const [title, setTitle] = useState(initial.title ?? '')
  const [type, setType] = useState<JobType>(initial.type ?? 'hvac')
  const [scheduledAt, setScheduledAt] = useState(initial.scheduledAt ?? '')
  const [notes, setNotes] = useState(initial.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit({ customerId, title, type, scheduledAt, notes })
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
          고객 <span className="text-red-500">*</span>
        </label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">고객 선택</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          작업명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="에어컨 청소 및 가스 충전"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">작업 유형</label>
        <div className="grid grid-cols-2 gap-2">
          {JOB_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                type === opt.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          예약 일시 <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">메모</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="작업 특이사항..."
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

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { InvoiceItems } from '@/components/invoice/InvoiceItems'
import { formatKRW } from '@/lib/utils'
import type { InvoiceItem } from '@/types'

function NewInvoiceForm({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [items, setItems] = useState<InvoiceItem[]>([{ label: '', qty: 1, unitPrice: 0 }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, items }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? '저장 실패')
      router.push(`/invoices/${json.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <InvoiceItems items={items} onChange={setItems} />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '발행 중...' : '청구서 발행'}
      </button>
    </form>
  )
}

function InvoiceListContent() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (jobId) { setLoading(false); return }
    fetch('/api/invoices')
      .then((r) => r.json())
      .then((json) => setInvoices(json.data ?? []))
      .finally(() => setLoading(false))
  }, [jobId])

  if (jobId) {
    return (
      <div>
        <PageHeader title="청구서 발행" backHref="/invoices" />
        <NewInvoiceForm jobId={jobId} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="청구서" />
      <div className="p-4 space-y-2">
        {loading ? (
          <div className="text-center py-8 text-sm text-slate-400">불러오는 중...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">청구서가 없습니다</div>
        ) : (
          invoices.map((inv) => (
            <Link key={inv.id} href={`/invoices/${inv.id}`} className="block">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{inv.job?.title ?? '작업'}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{inv.job?.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatKRW(inv.amount)}</p>
                    <span className={`text-xs font-medium ${inv.paidAt ? 'text-green-600' : 'text-amber-600'}`}>
                      {inv.paidAt ? '납부 완료' : '미납'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-400">불러오는 중...</div>}>
      <InvoiceListContent />
    </Suspense>
  )
}

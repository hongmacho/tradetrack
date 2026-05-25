'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { InvoiceItems } from '@/components/invoice/InvoiceItems'
import { formatKRW, formatDate, formatPhone } from '@/lib/utils'
import type { InvoiceItem } from '@/types'

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch(`/api/invoices/${id}`)
    const json = await res.json()
    setInvoice(json.data)
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  async function markPaid() {
    setPaying(true)
    await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markPaid' }),
    })
    await load()
    setPaying(false)
  }

  async function deleteInvoice() {
    if (!confirm('이 청구서를 삭제하시겠습니까?')) return
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' })
    router.push('/invoices')
  }

  if (loading) return <div className="p-4 text-sm text-slate-400">불러오는 중...</div>
  if (!invoice) return <div className="p-4 text-sm text-red-500">청구서를 찾을 수 없습니다</div>

  const items: InvoiceItem[] = Array.isArray(invoice.items) ? invoice.items : []

  return (
    <div>
      <PageHeader title="청구서" backHref="/invoices" />

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Invoice #{id.slice(0, 8).toUpperCase()}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${invoice.paidAt ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
              {invoice.paidAt ? '납부 완료' : '미납'}
            </span>
          </div>

          <div className="pt-1 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">고객</span>
              <Link href={`/customers/${invoice.job?.customerId}`} className="font-medium text-blue-600">
                {invoice.job?.customer?.name}
              </Link>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">연락처</span>
              <span className="text-slate-800">{formatPhone(invoice.job?.customer?.phone ?? '')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">작업</span>
              <Link href={`/jobs/${invoice.jobId}`} className="text-slate-800 font-medium">
                {invoice.job?.title}
              </Link>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">발행일</span>
              <span className="text-slate-800">{formatDate(invoice.issuedAt)}</span>
            </div>
            {invoice.paidAt && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">납부일</span>
                <span className="text-slate-800">{formatDate(invoice.paidAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">청구 항목</h3>
          <InvoiceItems items={items} onChange={() => {}} readonly />
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-900">총 청구금액</span>
          <span className="text-xl font-bold text-blue-900">{formatKRW(invoice.amount)}</span>
        </div>

        <a
          href={`/api/invoices/${id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF 다운로드
        </a>

        {!invoice.paidAt && (
          <button
            onClick={markPaid}
            disabled={paying}
            className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {paying ? '처리 중...' : '납부 완료 처리'}
          </button>
        )}

        <button
          onClick={deleteInvoice}
          className="w-full rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          청구서 삭제
        </button>
      </div>
    </div>
  )
}

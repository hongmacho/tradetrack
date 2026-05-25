'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { JobCard } from '@/components/job/JobCard'
import { formatPhone } from '@/lib/utils'

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch(`/api/customers/${id}?withJobs=true`)
    const json = await res.json()
    setCustomer(json.data)
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  async function deleteCustomer() {
    if (!confirm('이 고객을 삭제하시겠습니까?')) return
    await fetch(`/api/customers/${id}`, { method: 'DELETE' })
    router.push('/customers')
  }

  if (loading) return <div className="p-4 text-sm text-slate-400">불러오는 중...</div>
  if (!customer) return <div className="p-4 text-sm text-red-500">고객을 찾을 수 없습니다</div>

  return (
    <div>
      <PageHeader
        title={customer.name}
        backHref="/customers"
        action={
          <Link href={`/customers/${id}/edit`} className="text-sm text-blue-600 font-medium px-2 py-1">
            편집
          </Link>
        }
      />

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">연락처</span>
            <a href={`tel:${customer.phone}`} className="text-sm font-medium text-blue-600">
              {formatPhone(customer.phone)}
            </a>
          </div>
          {customer.address && (
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-slate-500 flex-shrink-0">주소</span>
              <span className="text-sm text-slate-800 text-right">{customer.address}</span>
            </div>
          )}
          {customer.notes && (
            <div>
              <span className="text-sm text-slate-500">메모</span>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{customer.notes}</p>
            </div>
          )}
        </div>

        <Link
          href={`/jobs/new?customerId=${id}`}
          className="block text-center rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          새 작업 등록
        </Link>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            작업 내역 ({customer.jobs?.length ?? 0}건)
          </h3>
          {customer.jobs?.length > 0 ? (
            <div className="space-y-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {customer.jobs.map((job: any) => (
                <JobCard key={job.id} job={{ ...job, customer }} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">작업 내역이 없습니다</p>
          )}
        </div>

        <button
          onClick={deleteCustomer}
          className="w-full rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          고객 삭제
        </button>
      </div>
    </div>
  )
}

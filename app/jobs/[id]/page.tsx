'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { JobStatusBadge } from '@/components/job/JobStatusBadge'
import { PhotoUpload } from '@/components/job/PhotoUpload'
import { formatDateTime, formatPhone } from '@/lib/utils'
import type { JobStatus } from '@/types'

const STATUS_TRANSITIONS: Record<JobStatus, { value: JobStatus; label: string }[]> = {
  scheduled: [
    { value: 'in_progress', label: '작업 시작' },
    { value: 'cancelled', label: '취소' },
  ],
  in_progress: [
    { value: 'completed', label: '작업 완료' },
    { value: 'cancelled', label: '취소' },
  ],
  completed: [],
  cancelled: [],
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)

  const loadJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${id}?withPhotos=true`)
    const json = await res.json()
    setJob(json.data)
    setLoading(false)
  }, [id])

  useEffect(() => { loadJob() }, [loadJob])

  async function updateStatus(status: JobStatus) {
    setStatusLoading(true)
    await fetch(`/api/jobs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await loadJob()
    setStatusLoading(false)
  }

  async function deleteJob() {
    if (!confirm('이 작업을 삭제하시겠습니까?')) return
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
    router.push('/jobs')
  }

  if (loading) return <div className="p-4 text-sm text-slate-400">불러오는 중...</div>
  if (!job) return <div className="p-4 text-sm text-red-500">작업을 찾을 수 없습니다</div>

  const transitions = STATUS_TRANSITIONS[job.status as JobStatus] ?? []

  return (
    <div>
      <PageHeader
        title={job.title}
        backHref="/jobs"
        action={
          <Link href={`/jobs/${id}/edit`} className="text-sm text-blue-600 font-medium px-2 py-1">
            편집
          </Link>
        }
      />

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">상태</span>
            <JobStatusBadge status={job.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">고객</span>
            <Link href={`/customers/${job.customerId}`} className="text-sm font-medium text-blue-600">
              {job.customer?.name}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">연락처</span>
            <a href={`tel:${job.customer?.phone}`} className="text-sm text-slate-800">
              {formatPhone(job.customer?.phone ?? '')}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">예약 일시</span>
            <span className="text-sm text-slate-800">{formatDateTime(job.scheduledAt)}</span>
          </div>
          {job.notes && (
            <div>
              <span className="text-sm text-slate-500">메모</span>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}
        </div>

        {transitions.length > 0 && (
          <div className="flex gap-2">
            {transitions.map((t) => (
              <button
                key={t.value}
                onClick={() => updateStatus(t.value)}
                disabled={statusLoading}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium disabled:opacity-50 ${
                  t.value === 'cancelled'
                    ? 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {job.status === 'completed' && (
          <Link
            href={`/invoices?jobId=${id}`}
            className="block text-center rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            청구서 발행
          </Link>
        )}

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">현장 사진</h3>
          {job.photos?.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {job.photos.map((p: any) => (
                <img key={p.id} src={p.url} alt={p.caption ?? ''} className="w-full aspect-square object-cover rounded-lg border border-slate-200" />
              ))}
            </div>
          )}
          <PhotoUpload jobId={id} onUploaded={loadJob} />
        </div>

        <button
          onClick={deleteJob}
          className="w-full rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          작업 삭제
        </button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { JobForm } from '@/components/job/JobForm'
import type { Customer, JobType } from '@/types'

export default function EditJobPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [job, setJob] = useState<any>(null)
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/jobs/${id}`).then((r) => r.json()),
      fetch('/api/customers').then((r) => r.json()),
    ]).then(([jobJson, custJson]) => {
      setJob(jobJson.data)
      setCustomers(custJson.data ?? [])
    })
  }, [id])

  async function handleSubmit(data: {
    customerId: string
    title: string
    type: string
    scheduledAt: string
    notes: string
  }) {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, scheduledAt: new Date(data.scheduledAt).toISOString() }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? '저장 실패')
    router.push(`/jobs/${id}`)
  }

  if (!job) return <div className="p-4 text-sm text-slate-400">불러오는 중...</div>

  const scheduledAt = job.scheduledAt
    ? new Date(job.scheduledAt).toISOString().slice(0, 16)
    : ''

  return (
    <div>
      <PageHeader title="작업 편집" backHref={`/jobs/${id}`} />
      <JobForm
        customers={customers}
        initial={{
          customerId: job.customerId,
          title: job.title,
          type: job.type as JobType,
          scheduledAt,
          notes: job.notes ?? '',
        }}
        onSubmit={handleSubmit}
        submitLabel="저장"
      />
    </div>
  )
}

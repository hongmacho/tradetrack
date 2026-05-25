'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { JobForm } from '@/components/job/JobForm'
import type { Customer } from '@/types'

export default function NewJobPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((json) => setCustomers(json.data ?? []))
  }, [])

  async function handleSubmit(data: {
    customerId: string
    title: string
    type: string
    scheduledAt: string
    notes: string
  }) {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, scheduledAt: new Date(data.scheduledAt).toISOString() }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? '저장 실패')
    router.push(`/jobs/${json.data.id}`)
  }

  return (
    <div>
      <PageHeader title="새 작업" backHref="/jobs" />
      <JobForm customers={customers} onSubmit={handleSubmit} submitLabel="작업 등록" />
    </div>
  )
}

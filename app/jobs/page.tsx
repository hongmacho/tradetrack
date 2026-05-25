'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { JobCard } from '@/components/job/JobCard'
import type { JobWithCustomer } from '@/types'

type Filter = 'today' | 'week' | 'all'

const FILTER_LABELS: Record<Filter, string> = {
  today: '오늘',
  week: '이번 주',
  all: '전체',
}

export default function JobsPage() {
  const [filter, setFilter] = useState<Filter>('week')
  const [jobs, setJobs] = useState<JobWithCustomer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/jobs?filter=${filter}`)
      .then((r) => r.json())
      .then((json) => setJobs(json.data ?? []))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div>
      <PageHeader
        title="작업"
        action={
          <Link href="/jobs/new" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">
            + 새 작업
          </Link>
        }
      />

      <div className="flex gap-1 px-4 py-3 bg-white border-b border-slate-200">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-2">
        {loading ? (
          <div className="text-center py-8 text-sm text-slate-400">불러오는 중...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">작업이 없습니다</div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  )
}

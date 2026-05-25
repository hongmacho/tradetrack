import Link from 'next/link'
import { JobStatusBadge } from './JobStatusBadge'
import { formatDateTime, formatPhone } from '@/lib/utils'
import type { JobWithCustomer } from '@/types'

const JOB_TYPE_LABELS: Record<string, string> = {
  hvac: '에어컨·냉난방',
  plumbing: '배관',
  electrical: '전기',
  other: '기타',
}

interface JobCardProps {
  job: JobWithCustomer
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="bg-white rounded-xl border border-slate-200 p-4 active:bg-slate-50 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate">{job.title}</p>
            <p className="text-sm text-slate-500 mt-0.5">{job.customer.name} · {formatPhone(job.customer.phone)}</p>
          </div>
          <JobStatusBadge status={job.status} />
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateTime(job.scheduledAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {JOB_TYPE_LABELS[job.type] ?? job.type}
          </span>
        </div>
      </div>
    </Link>
  )
}

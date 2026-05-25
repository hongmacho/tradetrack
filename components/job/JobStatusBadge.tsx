import { cn } from '@/lib/utils'
import type { JobStatus } from '@/types'

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  scheduled: {
    label: '예약됨',
    className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  },
  in_progress: {
    label: '진행 중',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
  completed: {
    label: '완료',
    className: 'bg-green-50 text-green-700 ring-green-600/20',
  },
  cancelled: {
    label: '취소',
    className: 'bg-slate-50 text-slate-600 ring-slate-500/20',
  },
}

interface JobStatusBadgeProps {
  status: string
  className?: string
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const config = STATUS_CONFIG[status as JobStatus] ?? { label: status, className: 'bg-slate-50 text-slate-600 ring-slate-500/20' }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

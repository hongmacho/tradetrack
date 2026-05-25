import Link from 'next/link'
import { JobCard } from '@/components/job/JobCard'
import type { JobWithCustomer } from '@/types'

interface RecentJobsProps {
  jobs: JobWithCustomer[]
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">
        예정된 작업이 없습니다
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
      <Link
        href="/jobs"
        className="block text-center text-sm text-blue-600 font-medium py-2"
      >
        전체 보기
      </Link>
    </div>
  )
}

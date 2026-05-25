import { StatCard } from '@/components/dashboard/StatCard'
import { RecentJobs } from '@/components/dashboard/RecentJobs'
import Link from 'next/link'

async function getDashboardData() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = await fetch(`${base}/api/dashboard`, { cache: 'no-store' })
  if (!res.ok) return { stats: null, recentJobs: [] }
  const json = await res.json()
  return json.data
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  const stats = data?.stats
  const recentJobs = data?.recentJobs ?? []

  return (
    <div>
      <div className="px-4 pt-6 pb-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">TradeTrack</h1>
            <p className="text-sm text-slate-500 mt-0.5">현장 작업 관리</p>
          </div>
          <Link
            href="/jobs/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            새 작업
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="오늘 작업" value={String(stats.todayJobs)} />
            <StatCard label="이번 주" value={String(stats.thisWeekJobs)} />
            <StatCard label="미수금" value={stats.unpaidCount > 0 ? `${stats.unpaidCount}건` : '없음'} subValue={stats.unpaidAmount > 0 ? `${stats.unpaidAmount.toLocaleString('ko-KR')}원` : undefined} />
            <StatCard label="이번 달 완료" value={String(stats.completedThisMonth)} />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">예정된 작업</h2>
          </div>
          <RecentJobs jobs={recentJobs} />
        </div>
      </div>
    </div>
  )
}

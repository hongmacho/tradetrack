import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  className?: string
}

export function StatCard({ label, value, subValue, className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-4', className)}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
    </div>
  )
}

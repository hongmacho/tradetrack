import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  backHref?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, backHref, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white', className)}>
      {backHref && (
        <Link href={backHref} className="p-1 -ml-1 rounded-lg hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      )}
      <h1 className="flex-1 text-lg font-semibold text-slate-900 truncate">{title}</h1>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

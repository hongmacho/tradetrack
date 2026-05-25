import Link from 'next/link'
import { formatPhone } from '@/lib/utils'
import type { Customer } from '@/types'

interface CustomerCardProps {
  customer: Customer
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link href={`/customers/${customer.id}`} className="block">
      <div className="bg-white rounded-xl border border-slate-200 p-4 active:bg-slate-50 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate">{customer.name}</p>
            <p className="text-sm text-slate-500 mt-0.5">{formatPhone(customer.phone)}</p>
          </div>
          <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        {customer.address && (
          <p className="text-xs text-slate-400 mt-2 truncate">{customer.address}</p>
        )}
      </div>
    </Link>
  )
}

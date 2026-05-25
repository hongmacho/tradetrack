'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { CustomerCard } from '@/components/customer/CustomerCard'
import type { Customer } from '@/types'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const q = search ? `?search=${encodeURIComponent(search)}` : ''
    fetch(`/api/customers${q}`)
      .then((r) => r.json())
      .then((json) => setCustomers(json.data ?? []))
      .finally(() => setLoading(false))
  }, [search])

  return (
    <div>
      <PageHeader
        title="고객"
        action={
          <Link href="/customers/new" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">
            + 추가
          </Link>
        }
      />

      <div className="px-4 py-3 bg-white border-b border-slate-200">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 연락처 검색"
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="p-4 space-y-2">
        {loading ? (
          <div className="text-center py-8 text-sm text-slate-400">불러오는 중...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">고객이 없습니다</div>
        ) : (
          customers.map((c) => <CustomerCard key={c.id} customer={c} />)
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { CustomerForm } from '@/components/customer/CustomerForm'

export default function EditCustomerPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((json) => setCustomer(json.data))
  }, [id])

  async function handleSubmit(data: { name: string; phone: string; address: string; notes: string }) {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? '저장 실패')
    router.push(`/customers/${id}`)
  }

  if (!customer) return <div className="p-4 text-sm text-slate-400">불러오는 중...</div>

  return (
    <div>
      <PageHeader title="고객 편집" backHref={`/customers/${id}`} />
      <CustomerForm
        initial={{
          name: customer.name,
          phone: customer.phone,
          address: customer.address ?? '',
          notes: customer.notes ?? '',
        }}
        onSubmit={handleSubmit}
        submitLabel="저장"
      />
    </div>
  )
}

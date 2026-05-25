'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { CustomerForm } from '@/components/customer/CustomerForm'

export default function NewCustomerPage() {
  const router = useRouter()

  async function handleSubmit(data: { name: string; phone: string; address: string; notes: string }) {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? '저장 실패')
    router.push(`/customers/${json.data.id}`)
  }

  return (
    <div>
      <PageHeader title="고객 추가" backHref="/customers" />
      <CustomerForm onSubmit={handleSubmit} submitLabel="고객 등록" />
    </div>
  )
}

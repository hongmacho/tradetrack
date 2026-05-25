import { NextResponse } from 'next/server'
import { jobRepository } from '@/repositories/job.repository'
import { invoiceRepository } from '@/repositories/invoice.repository'

export async function GET() {
  try {
    const todayJobs = jobRepository.findToday().length
    const thisWeekJobs = jobRepository.findThisWeek().length

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const allJobs = jobRepository.findAll()
    const completedThisMonth = allJobs.filter(
      (j) => j.status === 'completed' && j.completedAt && new Date(j.completedAt) >= monthStart
    ).length

    const unpaidInvoices = invoiceRepository.findUnpaid()
    const unpaidCount = unpaidInvoices.length
    const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0)

    const recentJobs = jobRepository.findThisWeek().slice(0, 5)

    return NextResponse.json({
      success: true,
      data: {
        stats: { todayJobs, thisWeekJobs, unpaidCount, unpaidAmount, completedThisMonth },
        recentJobs,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: '대시보드 데이터를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

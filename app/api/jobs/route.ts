import { NextRequest, NextResponse } from 'next/server'
import { jobRepository } from '@/repositories/job.repository'
import { jobCreateSchema } from '@/lib/validations/job.schema'

export async function GET(req: NextRequest) {
  try {
    const filter = req.nextUrl.searchParams.get('filter')
    let data
    if (filter === 'today') data = jobRepository.findToday()
    else if (filter === 'week') data = jobRepository.findThisWeek()
    else data = jobRepository.findAllWithCustomer()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '작업 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = jobCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const job = jobRepository.create({
      ...parsed.data,
      scheduledAt: new Date(parsed.data.scheduledAt),
    })
    return NextResponse.json({ success: true, data: job }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '작업 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

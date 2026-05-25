import { NextRequest, NextResponse } from 'next/server'
import { jobRepository } from '@/repositories/job.repository'
import { jobStatusSchema } from '@/lib/validations/job.schema'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = jobStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const job = jobRepository.updateStatus(id, parsed.data.status)
    if (!job) {
      return NextResponse.json({ success: false, error: '작업을 찾을 수 없습니다' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    const message = error instanceof Error ? error.message : '상태 변경 중 오류가 발생했습니다'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}

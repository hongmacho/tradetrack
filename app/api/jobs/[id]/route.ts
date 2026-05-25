import { NextRequest, NextResponse } from 'next/server'
import { jobRepository } from '@/repositories/job.repository'
import { jobUpdateSchema } from '@/lib/validations/job.schema'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const job = jobRepository.findByIdWithCustomer(id)
    if (!job) {
      return NextResponse.json({ success: false, error: '작업을 찾을 수 없습니다' }, { status: 404 })
    }
    const photos = jobRepository.findPhotos(id)
    return NextResponse.json({ success: true, data: { ...job, photos } })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '작업 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = jobUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const { scheduledAt: scheduledAtStr, ...rest } = parsed.data
    const updates = {
      ...rest,
      ...(scheduledAtStr ? { scheduledAt: new Date(scheduledAtStr) } : {}),
    }
    const job = jobRepository.update(id, updates)
    if (!job) {
      return NextResponse.json({ success: false, error: '작업을 찾을 수 없습니다' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '작업 수정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = jobRepository.findById(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: '작업을 찾을 수 없습니다' }, { status: 404 })
    }
    jobRepository.delete(id)
    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '작업 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

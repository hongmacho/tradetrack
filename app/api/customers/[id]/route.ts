import { NextRequest, NextResponse } from 'next/server'
import { customerRepository } from '@/repositories/customer.repository'
import { customerUpdateSchema } from '@/lib/validations/customer.schema'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = customerRepository.findWithJobs(id)
    if (!data) {
      return NextResponse.json({ success: false, error: '고객을 찾을 수 없습니다' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '고객 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = customerUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const customer = customerRepository.update(id, parsed.data)
    if (!customer) {
      return NextResponse.json({ success: false, error: '고객을 찾을 수 없습니다' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '고객 수정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = customerRepository.findById(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: '고객을 찾을 수 없습니다' }, { status: 404 })
    }
    customerRepository.delete(id)
    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '고객 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

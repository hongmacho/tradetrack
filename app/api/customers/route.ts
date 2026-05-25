import { NextRequest, NextResponse } from 'next/server'
import { customerRepository } from '@/repositories/customer.repository'
import { customerCreateSchema } from '@/lib/validations/customer.schema'

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search') ?? undefined
    const data = customerRepository.findAll(search)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '고객 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = customerCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const customer = customerRepository.create(parsed.data)
    return NextResponse.json({ success: true, data: customer }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '고객 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

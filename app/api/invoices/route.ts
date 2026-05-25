import { NextRequest, NextResponse } from 'next/server'
import { invoiceRepository } from '@/repositories/invoice.repository'
import { invoiceCreateSchema } from '@/lib/validations/invoice.schema'

export async function GET() {
  try {
    const data = invoiceRepository.findAllWithJob()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '청구서 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = invoiceCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const invoice = invoiceRepository.create(parsed.data)
    return NextResponse.json({ success: true, data: invoice }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '청구서 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

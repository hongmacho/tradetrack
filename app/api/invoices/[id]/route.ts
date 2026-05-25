import { NextRequest, NextResponse } from 'next/server'
import { invoiceRepository } from '@/repositories/invoice.repository'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = invoiceRepository.findWithJob(id)
    if (!data) {
      return NextResponse.json({ success: false, error: '청구서를 찾을 수 없습니다' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '청구서 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const invoice = invoiceRepository.markPaid(id)
    if (!invoice) {
      return NextResponse.json({ success: false, error: '청구서를 찾을 수 없습니다' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '납부 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = invoiceRepository.findById(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: '청구서를 찾을 수 없습니다' }, { status: 404 })
    }
    invoiceRepository.delete(id)
    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '청구서 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

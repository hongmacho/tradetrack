import { NextRequest, NextResponse } from 'next/server'
import { invoiceRepository } from '@/repositories/invoice.repository'
import { renderToBuffer } from '@react-pdf/renderer'
import React, { createElement } from 'react'
import { InvoiceDocument } from '@/lib/pdf/InvoiceDocument'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const invoice = invoiceRepository.findWithJob(id)
    if (!invoice) {
      return NextResponse.json({ success: false, error: '청구서를 찾을 수 없습니다' }, { status: 404 })
    }

    const pdfElement = createElement(InvoiceDocument, { invoice }) as unknown as Parameters<typeof renderToBuffer>[0]
    const buffer = await renderToBuffer(pdfElement)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'PDF 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

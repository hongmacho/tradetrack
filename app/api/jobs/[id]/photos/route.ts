import { NextRequest, NextResponse } from 'next/server'
import { jobRepository } from '@/repositories/job.repository'
import path from 'path'
import fs from 'fs/promises'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = jobRepository.findById(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: '작업을 찾을 수 없습니다' }, { status: 404 })
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const caption = (formData.get('caption') as string) ?? ''

    if (!file) {
      return NextResponse.json({ success: false, error: '파일을 선택해주세요' }, { status: 400 })
    }

    const ext = path.extname(file.name) || '.jpg'
    const filename = `${crypto.randomUUID()}${ext}`
    const filePath = path.join(UPLOAD_DIR, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    const url = `/uploads/${filename}`
    const photo = jobRepository.addPhoto(id, url, caption)
    return NextResponse.json({ success: true, data: photo }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '사진 업로드 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

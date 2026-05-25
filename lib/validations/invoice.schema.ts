import { z } from 'zod'

export const invoiceItemSchema = z.object({
  label: z.string().min(1, '항목명을 입력해주세요'),
  qty: z.number().int().min(1, '수량은 1 이상이어야 합니다'),
  unitPrice: z.number().int().min(0, '단가는 0 이상이어야 합니다'),
})

export const invoiceCreateSchema = z.object({
  jobId: z.string().min(1, '작업을 선택해주세요'),
  items: z.array(invoiceItemSchema).min(1, '항목을 1개 이상 추가해주세요'),
})

export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>

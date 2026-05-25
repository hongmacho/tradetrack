import { z } from 'zod'

export const customerCreateSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  phone: z
    .string()
    .min(9, '전화번호를 입력해주세요')
    .regex(/^[\d\-+]+$/, '유효한 전화번호를 입력해주세요'),
  address: z.string().default(''),
  notes: z.string().default(''),
})

export const customerUpdateSchema = customerCreateSchema.partial()

export type CustomerCreateInput = z.infer<typeof customerCreateSchema>
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>

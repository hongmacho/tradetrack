import { z } from 'zod'

export const JOB_TYPES = ['hvac', 'plumbing', 'electrical', 'other'] as const
export const JOB_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled'] as const

export const jobCreateSchema = z.object({
  customerId: z.string().min(1, '고객을 선택해주세요'),
  title: z.string().min(2, '작업 제목은 2자 이상이어야 합니다'),
  type: z.enum(JOB_TYPES, { message: '작업 유형을 선택해주세요' }),
  scheduledAt: z.string().min(1, '일정을 선택해주세요'),
  notes: z.string().default(''),
})

export const jobUpdateSchema = jobCreateSchema.partial()

export const jobStatusSchema = z.object({
  status: z.enum(JOB_STATUSES, { message: '유효하지 않은 상태입니다' }),
})

export type JobCreateInput = z.infer<typeof jobCreateSchema>
export type JobUpdateInput = z.infer<typeof jobUpdateSchema>
export type JobStatusInput = z.infer<typeof jobStatusSchema>

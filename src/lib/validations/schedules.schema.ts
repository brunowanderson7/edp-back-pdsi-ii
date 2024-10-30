import z from 'zod'

export const CreateScheduleSchema = z.object({
  meterId: z.string(),
  dateDate: z.string(),
  schedule: z.string(),
})

export const CreateRescheduleSchema = z.object({
  id: z.number(),
  dateDate: z.string(),
  schedule: z.string(),
  reason: z.enum(['CR', 'WS', 'DM']),
})

export type TCreateSchedule = z.infer<typeof CreateScheduleSchema>
export type TCreateReschedule = z.infer<typeof CreateRescheduleSchema>

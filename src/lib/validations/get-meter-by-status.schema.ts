import { z } from 'zod'

export const GetMeterByStatusSchema = z.object({
  status: z.enum([
    'SCHEDULED',
    'RECEIVED',
    'TESTING',
    'REHEARSED',
    'DISCARDED',
  ]),
})

export type TGetMeterByStatus = z.infer<typeof GetMeterByStatusSchema>

import z from 'zod'

export const CreateMeterSchema = z.object({
  number: z.string(),
  instalation: z.string(),
  toi: z.string(),
  note: z.string(),
  csd: z.string(),
  customerName: z.string(),
  customerPresent: z.boolean(),

  scheduledObservations: z.string().nullable().optional(),

  modelId: z.number().optional(),
  storageLocation: z.string().optional(),
  deliveredBy: z.string().optional(),
  entryObservations: z.string().optional(),
  status: z
    .enum(['SCHEDULED', 'RECEIVED', 'DISCARDED', 'TESTING', 'REHEARSED'])
    .optional(),
})

export const UpdateMeterSchema = CreateMeterSchema.partial()

export type TCreateMeter = z.infer<typeof CreateMeterSchema>
export type TUpdateMeter = z.infer<typeof UpdateMeterSchema>

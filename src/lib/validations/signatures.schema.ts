import z from 'zod'

export const CreateSignatuteSchema = z.object({
  type: z.string(),
  userId: z.string().uuid(),
  ratmId: z.string().uuid(),
})

export type TCreateSignatute = z.infer<typeof CreateSignatuteSchema>

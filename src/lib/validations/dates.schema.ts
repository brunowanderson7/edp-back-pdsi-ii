import z from 'zod'

export const CreateDeleteDateSchema = z.object({
  dates: z.array(z.string()),
})

export type TCreateDeleteDate = z.infer<typeof CreateDeleteDateSchema>

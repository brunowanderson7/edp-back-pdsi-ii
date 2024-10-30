import z from 'zod'

export const FindOneIntSchema = z.object({
  id: z
    .any()
    .refine((id) => parseInt(id), { message: 'Expect id to be int' })
    .transform((id) => parseInt(id)),
})

export const FindOneStringSchema = z.object({
  id: z.string(),
})

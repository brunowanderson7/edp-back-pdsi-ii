import z from 'zod'

export const CreateModelSchema = z.object({
  name: z.string(),
  type: z.string(),
  manufacturer: z.string(),
  voltage: z.string(),
  current: z.string(),
  wires: z.string(),
  class: z.string(),
  constant: z.string(),
})

export const UpdateModelSchema = CreateModelSchema.partial().refine(
  (data) => {
    const values = Object.values(data)
    return values.some((value) => value !== undefined && value !== null)
  },
  {
    message: 'At least one attribute must be provided',
  },
)

export type TCreateModel = z.infer<typeof CreateModelSchema>
export type TUpdateModel = z.infer<typeof UpdateModelSchema>

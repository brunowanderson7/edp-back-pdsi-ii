import z from 'zod'

export const QuantityOfMetersToTestSchema = z.object({
  quantity: z
    .any()
    .refine((quantity) => parseInt(quantity), {
      message: 'Expect quantity to be int',
    })
    .transform((quantity) => parseInt(quantity)),
})

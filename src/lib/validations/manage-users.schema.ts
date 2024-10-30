import z from 'zod'

export const updatePermissionsSchema = z.object({
  id: z
    .string({
      required_error: 'ID is required',
    })
    .uuid({
      message: 'ID is invalid',
    }),

  permissions: z.object({
    manager: z.boolean().optional(),
    dates: z.boolean().optional(),
    schedule: z.boolean().optional(),
    reschedule: z.boolean().optional(),
    ratm: z.boolean().optional(),
    model: z.boolean().optional(),
    discard: z.boolean().optional(),
    consult: z.boolean().optional(),
  }),
})

export const approveUserSchema = z.object({
  id: z
    .string({
      required_error: 'ID is required',
    })
    .uuid({
      message: 'ID is invalid',
    }),

  isUserApproved: z.boolean({
    required_error: 'isUserApproved is required',
  }),
})

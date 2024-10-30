import z from 'zod'

export const MeterStatusSchema = z.object({
  meterId: z.string(), // Notice the usage of quotes to define keys with hyphens
  meterStatus: z.enum([
    'SCHEDULED',
    'RECEIVED',
    'TESTING',
    'REHEARSED',
    'DISCARDED',
  ]),
})

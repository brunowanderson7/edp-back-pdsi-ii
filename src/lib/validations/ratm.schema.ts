import { z } from 'zod'

export const CreateRATMSchema = z.object({
  // id: z.string(),
  analyzeOrder: z.string(),
  clientAccompanied: z.boolean(),
  rehearsalVisual: z.string(),
  dielectric: z.string(),
  sealInvolucro: z.string(),
  statusInvolucro: z.string(),
  seal1: z.string(),
  statusLacre1: z.string(),
  seal2: z.string(),
  statusLacre2: z.string(),
  readingMeter: z.string(),
  tableTest: z.string(),
  cn: z.string(),
  ci: z.string(),
  cp: z.string(),
  cnri: z.string(),
  cnrc: z.string(),
  march: z.string(),
  register: z.string(),
  phaseInterrupted: z.string(),
  codeIrregularity: z.string(),
  descriptionIrregularity: z.string(),
  observationsIrregularity: z.string(),
  meterBroken: z.boolean(),
  displayOff: z.boolean(),
  easeAccess: z.boolean(),
  coilDamaged: z.boolean(),
  apparentlyOrder: z.boolean(),
  failedDielectric: z.boolean(),
  strangeBody: z.boolean(),
  burntBorne: z.boolean(),
  photoUrls: z.array(z.string()),
  meterId: z.string(),
})

export const UpdateRATMSchema = CreateRATMSchema.partial().refine(
  (data) => {
    const values = Object.values(data)
    return values.some((value) => value !== undefined && value !== null)
  },
  {
    message: 'At least one attribute must be provided',
  },
)

export type TCreateRATM = z.infer<typeof CreateRATMSchema>
export type TUpdateRATM = z.infer<typeof UpdateRATMSchema>

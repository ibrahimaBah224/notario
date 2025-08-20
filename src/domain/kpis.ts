import { z } from 'zod'

export const KpisSchema = z.object({
  dossiers: z.number(),
  actes: z.number(),
  paiements: z.number(),
  sla: z.union([z.number(), z.string()]),
})

export type Kpis = z.infer<typeof KpisSchema>




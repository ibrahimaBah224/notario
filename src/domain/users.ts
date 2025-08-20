import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  nom: z.string(),
  prenom: z.string(),
  role: z.string(),
  tel: z.string(),
})

export type User = z.infer<typeof UserSchema>




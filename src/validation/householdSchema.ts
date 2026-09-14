import { z } from 'zod'

export const householdMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  colorTag: z.string().optional()
})

export const householdSchema = z.object({
  name: z.string()
})

import { z } from 'zod'

export const addCategoryFormSchema = z.object({
  name: z.string().trim().min(1, 'validation.nameRequired')
})

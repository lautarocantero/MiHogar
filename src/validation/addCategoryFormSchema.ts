import { z } from 'zod'

export const addCategoryFormSchema = z.object({
  name: z.string().min(1, 'Ingresá un nombre')
})

import { z } from 'zod'

export const unlockFormSchema = z.object({
  householdKey: z.string().min(1, 'Ingresá la clave del hogar')
})

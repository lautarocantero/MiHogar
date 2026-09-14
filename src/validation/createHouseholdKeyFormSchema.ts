import { z } from 'zod'

export const createHouseholdKeyFormSchema = z
  .object({
    householdKey: z.string().min(8, 'La clave debe tener al menos 8 caracteres'),
    confirmHouseholdKey: z.string()
  })
  .refine((data) => data.householdKey === data.confirmHouseholdKey, {
    message: 'Las claves no coinciden',
    path: ['confirmHouseholdKey']
  })

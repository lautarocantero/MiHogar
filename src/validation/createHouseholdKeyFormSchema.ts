import { z } from 'zod'

export const createHouseholdKeyFormSchema = z
  .object({
    householdKey: z.string().min(8, 'validation.keyTooShort'),
    confirmHouseholdKey: z.string()
  })
  .refine((data) => data.householdKey === data.confirmHouseholdKey, {
    message: 'validation.keysDontMatch',
    path: ['confirmHouseholdKey']
  })

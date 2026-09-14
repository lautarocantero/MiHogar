import { z } from 'zod'

export const editCredentialsFormSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  clientNumber: z.string().optional(),
  providerUrl: z
    .union([z.string().url('Ingresá una dirección web válida'), z.literal('')])
    .optional()
})

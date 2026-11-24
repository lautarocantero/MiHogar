import { z } from 'zod'
import { isHttpUrl } from '@/utils/resolveUrlHostname'

export const editCredentialsFormSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  clientNumber: z.string().optional(),
  providerUrl: z
    .union([
      z.string().url('validation.urlInvalid').refine(isHttpUrl, 'validation.urlInvalid'),
      z.literal('')
    ])
    .optional()
})

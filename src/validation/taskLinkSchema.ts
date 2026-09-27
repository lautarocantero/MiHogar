import { z } from 'zod'

export const taskLinkSchema = z.object({
  id: z.string().min(1),
  repo: z.string().min(1),
  type: z.enum(['pr', 'issue']),
  number: z.number().int().positive(),
  url: z.string().min(1),
  title: z.string().optional(),
  state: z.enum(['open', 'closed', 'merged', 'draft']).optional(),
  stateReason: z.enum(['completed', 'not_planned', 'reopened']).optional(),
  approved: z.boolean().optional(),
  mergedAt: z.string().optional(),
  mergeCommitSha: z.string().optional(),
  etag: z.string().optional(),
  syncedAt: z.string().optional(),
  syncError: z.string().optional()
})

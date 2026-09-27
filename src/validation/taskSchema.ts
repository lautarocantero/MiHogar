import { z } from 'zod'
import { TaskSeverity, TaskStatusId } from '@/typings/domain/enums'
import { taskLinkSchema } from './taskLinkSchema'

const taskChecklistItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(500),
  done: z.boolean()
})

const taskNoteSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(4000),
  createdAt: z.string()
})

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Fecha inválida')

export const taskSchema = z
  .object({
    id: z.string().min(1),
    seq: z.number().int().nonnegative(),
    title: z.string().min(1).max(200),
    description: z.string().max(20000).default(''),
    statusId: z.nativeEnum(TaskStatusId),
    severity: z.nativeEnum(TaskSeverity).default(TaskSeverity.MEDIUM),
    categoryIds: z.array(z.string().min(1)).max(10).default([]),
    repos: z.array(z.string().min(1)).max(10).default([]),
    links: z.array(taskLinkSchema).max(50).default([]),
    checklist: z.array(taskChecklistItemSchema).max(200).default([]),
    notes: z.array(taskNoteSchema).max(200).default([]),
    startDate: isoDateSchema.optional(),
    dueDate: isoDateSchema.optional(),
    rank: z.number(),
    archivedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    updatedBy: z.enum(['user', 'github'])
  })
  .refine((task) => !task.startDate || !task.dueDate || task.startDate <= task.dueDate, {
    message: 'La fecha de inicio no puede ser posterior a la fecha límite',
    path: ['dueDate']
  })

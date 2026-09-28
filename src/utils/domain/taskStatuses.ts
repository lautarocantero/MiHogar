import { TaskStatusId } from '@/typings/domain/enums'

export type TaskStatusRole = 'intake' | 'wip' | 'review' | 'done'

export type TaskStatusDefinition = {
  id: TaskStatusId
  label: string
  role?: TaskStatusRole
}

export const TASK_STATUSES: readonly TaskStatusDefinition[] = [
  { id: TaskStatusId.BACKLOG, label: 'Backlog', role: 'intake' },
  { id: TaskStatusId.TODO, label: 'Por hacer' },
  { id: TaskStatusId.IN_PROGRESS, label: 'En curso', role: 'wip' },
  { id: TaskStatusId.IN_REVIEW, label: 'En revisión', role: 'review' },
  { id: TaskStatusId.BLOCKED, label: 'Bloqueada' },
  { id: TaskStatusId.DONE, label: 'Hecho', role: 'done' }
]

export const TASK_KEY_PREFIX = 'MIHOGAR'

export const TASK_GITHUB_REPOS = ['lautarocantero/MiHogar'] as const

export function findTaskStatusByRole(role: TaskStatusRole): TaskStatusDefinition | undefined {
  return TASK_STATUSES.find((status) => status.role === role)
}

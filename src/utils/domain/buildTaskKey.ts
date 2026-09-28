import { TASK_KEY_PREFIX } from './taskStatuses'

export function buildTaskKey(seq: number): string {
  return `${TASK_KEY_PREFIX}-${seq}`
}

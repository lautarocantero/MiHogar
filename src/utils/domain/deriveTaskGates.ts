import type { Task, TaskGates } from '@/typings/domain/types'
import { TASK_GITHUB_REPOS } from './taskStatuses'

function countedPullLinks(task: Task): Task['links'] {
  return task.links.filter(
    (link) => link.type === 'pr' && (TASK_GITHUB_REPOS as readonly string[]).includes(link.repo)
  )
}

export function deriveTaskGates(task: Task): TaskGates {
  const pulls = countedPullLinks(task)
  const merged = pulls.length > 0 && pulls.every((link) => link.state === 'merged')
  const approved = pulls.length > 0 && pulls.every((link) => link.approved === true)
  return { merged, approved }
}

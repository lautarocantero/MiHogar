import { TASK_GITHUB_REPOS, TASK_STATUSES, findTaskStatusByRole } from './taskStatuses'
import type { TaskLink } from '@/typings/domain/types'
import type { TaskStatusId } from '@/typings/domain/enums'

function countedPulls(links: TaskLink[]): TaskLink[] {
  return links.filter(
    (link) => link.type === 'pr' && (TASK_GITHUB_REPOS as readonly string[]).includes(link.repo)
  )
}

export function decideTaskTransition(
  currentStatusId: TaskStatusId,
  linksBefore: TaskLink[],
  linksAfter: TaskLink[]
): TaskStatusId | null {
  const currentStatus = TASK_STATUSES.find((status) => status.id === currentStatusId)
  const pullsAfter = countedPulls(linksAfter)
  const pullsBefore = countedPulls(linksBefore)

  if (currentStatus?.role === 'wip') {
    const hasOpenNonDraft = pullsAfter.some((link) => link.state === 'open')
    if (hasOpenNonDraft) {
      return findTaskStatusByRole('review')?.id ?? null
    }
  }

  const hadOpenBefore = pullsBefore.some((link) => link.state === 'open')
  const hasOpenAfter = pullsAfter.some((link) => link.state === 'open')
  const allMergedAfter =
    pullsAfter.length > 0 && pullsAfter.every((link) => link.state === 'merged')

  if (hadOpenBefore && !hasOpenAfter && allMergedAfter && currentStatus?.role !== 'done') {
    return findTaskStatusByRole('done')?.id ?? null
  }

  return null
}

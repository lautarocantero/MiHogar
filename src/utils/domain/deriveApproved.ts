import type { GithubReview } from '@/apis/githubTasksApi'

const IGNORED_STATES = new Set(['COMMENTED', 'DISMISSED', 'PENDING'])

export function deriveApproved(reviews: GithubReview[]): boolean {
  const latestByReviewer = new Map<string, GithubReview>()

  const sorted = [...reviews].sort(
    (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
  )

  for (const review of sorted) {
    if (!review.user || IGNORED_STATES.has(review.state)) {
      continue
    }
    latestByReviewer.set(review.user.login, review)
  }

  const verdicts = [...latestByReviewer.values()]
  return verdicts.length > 0 && verdicts.every((review) => review.state === 'APPROVED')
}

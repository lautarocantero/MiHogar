const GITHUB_API_BASE = 'https://api.github.com'

export type GithubPull = {
  number: number
  title: string
  state: 'open' | 'closed'
  draft?: boolean
  merged_at: string | null
  merge_commit_sha: string | null
  head: { ref: string }
  base: { repo: { full_name: string } }
}

export type GithubIssue = {
  number: number
  state: 'open' | 'closed'
  state_reason?: 'completed' | 'not_planned' | 'reopened' | null
  pull_request?: unknown
}

export type GithubReview = {
  user: { login: string } | null
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING'
  submitted_at: string
}

export type GithubFetchResult<T> =
  | { status: 'ok'; data: T; etag?: string }
  | { status: 'not_modified' }
  | { status: 'error'; message: string }

function authHeaders(token: string, etag?: string): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json'
  }
  if (etag) {
    headers['If-None-Match'] = etag
  }
  return headers
}

export async function listPulls(repo: string, token: string): Promise<GithubPull[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=30`,
    { headers: authHeaders(token) }
  )
  if (!response.ok) {
    throw new Error(`No se pudo listar PRs de ${repo} (${response.status})`)
  }
  return (await response.json()) as GithubPull[]
}

export async function getPull(
  repo: string,
  number: number,
  token: string,
  etag?: string
): Promise<GithubFetchResult<GithubPull>> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${repo}/pulls/${number}`, {
    headers: authHeaders(token, etag)
  })
  if (response.status === 304) {
    return { status: 'not_modified' }
  }
  if (!response.ok) {
    return { status: 'error', message: `No se pudo leer el PR #${number} (${response.status})` }
  }
  return {
    status: 'ok',
    data: (await response.json()) as GithubPull,
    etag: response.headers.get('etag') ?? undefined
  }
}

export async function getIssue(
  repo: string,
  number: number,
  token: string,
  etag?: string
): Promise<GithubFetchResult<GithubIssue>> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${repo}/issues/${number}`, {
    headers: authHeaders(token, etag)
  })
  if (response.status === 304) {
    return { status: 'not_modified' }
  }
  if (!response.ok) {
    return { status: 'error', message: `No se pudo leer el issue #${number} (${response.status})` }
  }
  return {
    status: 'ok',
    data: (await response.json()) as GithubIssue,
    etag: response.headers.get('etag') ?? undefined
  }
}

export async function listReviews(
  repo: string,
  number: number,
  token: string
): Promise<GithubReview[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/pulls/${number}/reviews?per_page=100`,
    { headers: authHeaders(token) }
  )
  if (!response.ok) {
    throw new Error(`No se pudieron leer las reviews del PR #${number} (${response.status})`)
  }
  return (await response.json()) as GithubReview[]
}

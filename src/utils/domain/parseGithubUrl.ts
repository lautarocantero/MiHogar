export type ParsedGithubUrl = {
  repo: string
  type: 'pr' | 'issue'
  number: number
}

const GITHUB_URL_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(pull|issues)\/(\d+)(?:[/?#].*)?$/

export function parseGithubUrl(url: string): ParsedGithubUrl | null {
  const match = GITHUB_URL_RE.exec(url.trim())
  if (!match) {
    return null
  }
  const [, owner, repo, kind, number] = match
  return {
    repo: `${owner}/${repo}`,
    type: kind === 'pull' ? 'pr' : 'issue',
    number: Number(number)
  }
}

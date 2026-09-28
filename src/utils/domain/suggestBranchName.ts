import { TASK_KEY_PREFIX } from './taskStatuses'

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function suggestBranchName(seq: number, title: string): string {
  const slug = stripAccents(title)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .join('-')
    .replace(/[^a-z0-9-]/g, '')

  const key = `${TASK_KEY_PREFIX}-${seq}`.toLowerCase()
  return slug ? `${key}-${slug}` : key
}

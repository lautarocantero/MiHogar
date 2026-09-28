import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import type { TasksFile } from '@shared/vaultEnvelope.types'
import { getTasksFilePath } from './vaultPaths'

const DEFAULT_TASK_CATEGORIES: TasksFile['categories'] = [
  { id: 'bug', label: 'Bug', color: '#f87171' },
  { id: 'feature', label: 'Feature', color: '#818cf8' },
  { id: 'qa', label: 'QA', color: '#34d399' },
  { id: 'chore', label: 'Chore', color: '#94a3b8' }
]

const DEFAULT_TASKS_FILE: TasksFile = {
  version: 1,
  tasks: [],
  categories: DEFAULT_TASK_CATEGORIES,
  nextSeq: 0
}

export async function readTasksFile(): Promise<TasksFile> {
  const path = getTasksFilePath()
  if (!existsSync(path)) {
    return DEFAULT_TASKS_FILE
  }
  const raw = await readFile(path, 'utf8')
  return JSON.parse(raw) as TasksFile
}

export async function writeTasksFile(tasksFile: TasksFile): Promise<void> {
  await writeFile(getTasksFilePath(), JSON.stringify(tasksFile), 'utf8')
}

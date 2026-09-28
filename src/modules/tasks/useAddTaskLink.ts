import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { parseGithubUrl } from '@/utils/domain/parseGithubUrl'
import type { Task } from '@/typings/domain/types'
import { useUpdateTask } from './useUpdateTask'

const MAX_LINKS_PER_TASK = 50

export function useAddTaskLink(task: Task): {
  error: string | null
  addLink: (url: string) => boolean
} {
  const updateTask = useUpdateTask()
  const [error, setError] = useState<string | null>(null)

  const addLink = useCallback(
    (url: string): boolean => {
      const parsed = parseGithubUrl(url)
      if (!parsed) {
        setError('Pegá un link de PR o issue de GitHub válido')
        return false
      }
      if (task.links.length >= MAX_LINKS_PER_TASK) {
        setError('Esta tarea ya tiene el máximo de 50 links')
        return false
      }
      const alreadyLinked = task.links.some(
        (link) => link.repo === parsed.repo && link.number === parsed.number
      )
      if (alreadyLinked) {
        setError('Ese link ya está vinculado a la tarea')
        return false
      }
      setError(null)
      updateTask(task, {
        links: [
          ...task.links,
          { id: uuidv4(), repo: parsed.repo, type: parsed.type, number: parsed.number, url }
        ]
      })
      return true
    },
    [task, updateTask]
  )

  return { error, addLink }
}

import { useCallback } from 'react'
import type { Task } from '@/typings/domain/types'
import { useUpdateTask } from './useUpdateTask'

export function useRemoveTaskLink(): (task: Task, linkId: string) => void {
  const updateTask = useUpdateTask()

  return useCallback(
    (task: Task, linkId: string) => {
      updateTask(task, { links: task.links.filter((link) => link.id !== linkId) })
    },
    [updateTask]
  )
}

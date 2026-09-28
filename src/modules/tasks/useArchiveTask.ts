import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateTask } from '@/store/tasks/tasksSlice'
import { showToast } from '@/store/ui/uiSlice'
import type { Task } from '@/typings/domain/types'

export function useArchiveTask(): {
  archive: (task: Task) => void
  restore: (task: Task) => void
} {
  const dispatch = useAppDispatch()

  const archive = useCallback(
    (task: Task) => {
      dispatch(
        updateTask({
          ...task,
          archivedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedBy: 'user'
        })
      )
      dispatch(showToast('Tarea archivada'))
    },
    [dispatch]
  )

  const restore = useCallback(
    (task: Task) => {
      const rest: Task = { ...task }
      delete rest.archivedAt
      dispatch(
        updateTask({
          ...rest,
          updatedAt: new Date().toISOString(),
          updatedBy: 'user'
        })
      )
      dispatch(showToast('Tarea restaurada'))
    },
    [dispatch]
  )

  return { archive, restore }
}

import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateTask } from '@/store/tasks/tasksSlice'
import type { Task } from '@/typings/domain/types'

export function useUpdateTask(): (task: Task, patch: Partial<Task>) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (task: Task, patch: Partial<Task>) => {
      dispatch(
        updateTask({
          ...task,
          ...patch,
          updatedAt: new Date().toISOString(),
          updatedBy: 'user'
        })
      )
    },
    [dispatch]
  )
}

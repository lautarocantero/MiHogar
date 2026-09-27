import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateTask } from '@/store/tasks/tasksSlice'
import { selectAllTasks } from '@/store/tasks/tasksSelectors'
import { rankBetween } from '@/utils/domain/rankBetween'
import type { TaskStatusId } from '@/typings/domain/enums'

export function useMoveTask(): (
  taskId: string,
  statusId: TaskStatusId,
  beforeId?: string,
  afterId?: string
) => void {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectAllTasks)

  return useCallback(
    (taskId: string, statusId: TaskStatusId, beforeId?: string, afterId?: string) => {
      const task = tasks.find((candidate) => candidate.id === taskId)
      if (!task) {
        return
      }
      const beforeTask = beforeId ? tasks.find((candidate) => candidate.id === beforeId) : undefined
      const afterTask = afterId ? tasks.find((candidate) => candidate.id === afterId) : undefined
      const rank = rankBetween(beforeTask?.rank, afterTask?.rank)
      dispatch(
        updateTask({
          ...task,
          statusId,
          rank,
          updatedAt: new Date().toISOString(),
          updatedBy: 'user'
        })
      )
    },
    [dispatch, tasks]
  )
}

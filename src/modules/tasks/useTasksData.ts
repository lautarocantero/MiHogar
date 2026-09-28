import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAllTasks } from '@/store/tasks/tasksSelectors'
import { loadTasksThunk } from '@/store/tasks/tasksThunks'
import { setErrorMessage } from '@/store/ui/uiSlice'
import { buildTaskKey } from '@/utils/domain/buildTaskKey'
import { deriveTaskGates } from '@/utils/domain/deriveTaskGates'
import type { UseTasksDataResult } from './typings/types'

export function useTasksData(): UseTasksDataResult {
  const dispatch = useAppDispatch()
  const rawTasks = useAppSelector(selectAllTasks)
  const [isLoading, setIsLoading] = useState(true)

  useEffect((): (() => void) => {
    let isMounted = true
    dispatch(loadTasksThunk())
      .unwrap()
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'No se pudieron cargar las tareas'
        dispatch(setErrorMessage(message))
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tasks = useMemo(
    () =>
      rawTasks.map((task) => ({
        ...task,
        key: buildTaskKey(task.seq),
        gates: deriveTaskGates(task)
      })),
    [rawTasks]
  )

  return { tasks, isLoading }
}

import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addTask } from '@/store/tasks/tasksSlice'
import { selectAllTasks, selectNextTaskSeq } from '@/store/tasks/tasksSelectors'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { TaskSeverity, TaskStatusId } from '@/typings/domain/enums'
import { TASK_STATUSES, findTaskStatusByRole } from '@/utils/domain/taskStatuses'
import { rankBetween } from '@/utils/domain/rankBetween'
import type { Task } from '@/typings/domain/types'
import type { AddTaskFormValues } from '@/validation/addTaskFormSchema'
import type { UseCreateTaskResult } from './typings/hooks'

function intakeStatusId(): TaskStatusId {
  return findTaskStatusByRole('intake')?.id ?? TASK_STATUSES[0].id
}

export function useCreateTask(onCreated: () => void): UseCreateTaskResult {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectAllTasks)
  const nextSeq = useAppSelector(selectNextTaskSeq)
  const { isLoading, error, run } = useLoader()

  const buildNewTask = useCallback(
    (values: {
      title: string
      description?: string
      severity?: TaskSeverity
      categoryIds?: string[]
      startDate?: string
      dueDate?: string
    }): Omit<Task, 'seq'> => {
      const statusId = intakeStatusId()
      const columnTasks = tasks.filter((task) => task.statusId === statusId && !task.archivedAt)
      const minRank =
        columnTasks.length > 0 ? Math.min(...columnTasks.map((task) => task.rank)) : undefined
      const now = new Date().toISOString()
      return {
        id: uuidv4(),
        title: values.title,
        description: values.description ?? '',
        statusId,
        severity: values.severity ?? TaskSeverity.MEDIUM,
        categoryIds: values.categoryIds ?? [],
        repos: [],
        links: [],
        checklist: [],
        notes: [],
        startDate: values.startDate || undefined,
        dueDate: values.dueDate || undefined,
        rank: rankBetween(undefined, minRank),
        createdAt: now,
        updatedAt: now,
        updatedBy: 'user'
      }
    },
    [tasks]
  )

  const createFromTitle = useCallback(
    (title: string) => {
      dispatch(addTask(buildNewTask({ title }), nextSeq))
    },
    [dispatch, buildNewTask, nextSeq]
  )

  const submit = useCallback(
    (values: AddTaskFormValues) => {
      run(async () => {
        dispatch(addTask(buildNewTask(values), nextSeq))
        dispatch(showToast('Tarea agregada'))
        onCreated()
      }, 'No se pudo agregar la tarea')
    },
    [buildNewTask, dispatch, nextSeq, run, onCreated]
  )

  return { submit, createFromTitle, isSubmitting: isLoading, errorMessage: error }
}

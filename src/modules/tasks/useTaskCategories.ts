import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  addTaskCategory,
  removeTaskCategory,
  updateTaskCategory
} from '@/store/taskCategories/taskCategoriesSlice'
import { selectAllTaskCategories } from '@/store/taskCategories/taskCategoriesSelectors'
import { selectAllTasks } from '@/store/tasks/tasksSelectors'
import { updateTask } from '@/store/tasks/tasksSlice'
import type { TaskCategory } from '@/typings/domain/types'
import type { AddTaskCategoryFormValues } from '@/validation/addTaskCategoryFormSchema'

export function useTaskCategories(): {
  categories: TaskCategory[]
  create: (values: AddTaskCategoryFormValues) => void
  update: (category: TaskCategory, values: AddTaskCategoryFormValues) => void
  remove: (categoryId: string) => void
} {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectAllTaskCategories)
  const tasks = useAppSelector(selectAllTasks)

  const create = useCallback(
    (values: AddTaskCategoryFormValues) => {
      dispatch(addTaskCategory({ id: uuidv4(), label: values.label, color: values.color }))
    },
    [dispatch]
  )

  const update = useCallback(
    (category: TaskCategory, values: AddTaskCategoryFormValues) => {
      dispatch(updateTaskCategory({ ...category, ...values }))
    },
    [dispatch]
  )

  const remove = useCallback(
    (categoryId: string) => {
      dispatch(removeTaskCategory(categoryId))
      tasks
        .filter((task) => task.categoryIds.includes(categoryId))
        .forEach((task) => {
          dispatch(
            updateTask({
              ...task,
              categoryIds: task.categoryIds.filter((id) => id !== categoryId),
              updatedAt: new Date().toISOString(),
              updatedBy: 'user'
            })
          )
        })
    },
    [dispatch, tasks]
  )

  return { categories, create, update, remove }
}

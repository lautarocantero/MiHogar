import { isAnyOf } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/store'
import { saveTasksThunk } from '@/store/tasks/tasksThunks'
import { addTask, updateTask, removeTask, applyGithubSync } from '@/store/tasks/tasksSlice'
import {
  addTaskCategory,
  updateTaskCategory,
  removeTaskCategory
} from '@/store/taskCategories/taskCategoriesSlice'
import { setErrorMessage } from '@/store/ui/uiSlice'

const isMutatingAction = isAnyOf(
  addTask,
  updateTask,
  removeTask,
  applyGithubSync,
  addTaskCategory,
  updateTaskCategory,
  removeTaskCategory
)

export const tasksPersistenceMiddleware: Middleware<object, RootState, AppDispatch> =
  (storeApi) => (next) => (action) => {
    const result = next(action)

    if (!isMutatingAction(action)) {
      return result
    }

    storeApi
      .dispatch(saveTasksThunk())
      .unwrap()
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'No se pudo guardar la tarea'
        storeApi.dispatch(setErrorMessage(message))
      })

    return result
  }

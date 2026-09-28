import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TaskCategory } from '@/typings/domain/types'

const taskCategoriesAdapter = createEntityAdapter<TaskCategory>()

const taskCategoriesSlice = createSlice({
  name: 'taskCategories',
  initialState: taskCategoriesAdapter.getInitialState(),
  reducers: {
    hydrateTaskCategories: taskCategoriesAdapter.setAll,
    addTaskCategory: taskCategoriesAdapter.addOne,
    updateTaskCategory: (state, action: PayloadAction<TaskCategory>) => {
      taskCategoriesAdapter.upsertOne(state, action.payload)
    },
    removeTaskCategory: taskCategoriesAdapter.removeOne
  }
})

export const { hydrateTaskCategories, addTaskCategory, updateTaskCategory, removeTaskCategory } =
  taskCategoriesSlice.actions
export const taskCategoriesReducer = taskCategoriesSlice.reducer
export const taskCategoriesSelectors = taskCategoriesAdapter.getSelectors()

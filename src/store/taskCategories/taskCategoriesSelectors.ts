import type { RootState } from '@/store'
import type { TaskCategory } from '@/typings/domain/types'
import { taskCategoriesSelectors } from './taskCategoriesSlice'

export const selectAllTaskCategories = (state: RootState): TaskCategory[] =>
  taskCategoriesSelectors.selectAll(state.taskCategories)

export const selectTaskCategoryById = (
  state: RootState,
  categoryId: string
): TaskCategory | undefined => taskCategoriesSelectors.selectById(state.taskCategories, categoryId)

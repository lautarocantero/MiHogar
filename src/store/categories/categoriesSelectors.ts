import type { RootState } from '@/store'
import type { Category } from '@/typings/domain/types'
import { categoriesSelectors } from './categoriesSlice'

export const selectAllCategories = (state: RootState): Category[] =>
  categoriesSelectors.selectAll(state.categories)

export const selectCategoryById = (state: RootState, categoryId: string): Category | undefined =>
  categoriesSelectors.selectById(state.categories, categoryId)

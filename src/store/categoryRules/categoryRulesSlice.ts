import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CategoryRule } from '@/typings/domain/types'

const categoryRulesAdapter = createEntityAdapter<CategoryRule>()

const categoryRulesSlice = createSlice({
  name: 'categoryRules',
  initialState: categoryRulesAdapter.getInitialState(),
  reducers: {
    hydrateCategoryRules: categoryRulesAdapter.setAll,
    upsertCategoryRule: (state, action: PayloadAction<CategoryRule>) => {
      categoryRulesAdapter.upsertOne(state, action.payload)
    },
    removeCategoryRule: categoryRulesAdapter.removeOne
  }
})

export const { hydrateCategoryRules, upsertCategoryRule, removeCategoryRule } =
  categoryRulesSlice.actions
export const categoryRulesReducer = categoryRulesSlice.reducer
export const categoryRulesSelectors = categoryRulesAdapter.getSelectors()

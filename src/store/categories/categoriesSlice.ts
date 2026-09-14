import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Category } from '@/typings/domain/types'

const categoriesAdapter = createEntityAdapter<Category>()

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: categoriesAdapter.getInitialState(),
  reducers: {
    hydrateCategories: categoriesAdapter.setAll,
    addCategory: categoriesAdapter.addOne,
    updateCategory: (state, action: PayloadAction<Category>) => {
      categoriesAdapter.upsertOne(state, action.payload)
    },
    removeCategory: categoriesAdapter.removeOne
  }
})

export const { hydrateCategories, addCategory, updateCategory, removeCategory } =
  categoriesSlice.actions
export const categoriesReducer = categoriesSlice.reducer
export const categoriesSelectors = categoriesAdapter.getSelectors()

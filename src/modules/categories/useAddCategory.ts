import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addCategory } from '@/store/categories/categoriesSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import type { CategoryKind } from '@/typings/domain/enums'
import type { AddCategoryFormValues, UseAddCategoryResult } from './typings/types'

export function useAddCategory(
  kind: CategoryKind,
  onCreated: (categoryId: string) => void
): UseAddCategoryResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddCategoryFormValues) => {
      run(async () => {
        const id = uuidv4()
        dispatch(addCategory({ id, name: values.name, kind }))
        onCreated(id)
      }, 'No se pudo agregar el concepto')
    },
    [dispatch, run, onCreated, kind]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

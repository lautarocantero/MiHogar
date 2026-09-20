import { useState } from 'react'
import { Divider, MenuItem, TextField } from '@mui/material'
import { useAppSelector } from '@/store/hooks'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { AddCategoryDialog } from '@/modules/categories/components/AddCategoryDialog'
import type { CategoryFieldProps } from './typings/props'

const ADD_NEW_CATEGORY_VALUE = '__add_category__'

export function CategoryField({
  kind,
  value,
  onChange,
  error,
  helperText,
  label = 'Concepto'
}: CategoryFieldProps): React.JSX.Element {
  const allCategories = useAppSelector(selectAllCategories)
  const categories = allCategories.filter((category) => category.kind === kind)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  return (
    <>
      <TextField
        fullWidth
        label={label}
        select
        value={value}
        onChange={(event) => {
          if (event.target.value === ADD_NEW_CATEGORY_VALUE) {
            setIsAddCategoryOpen(true)
            return
          }
          onChange(event.target.value)
        }}
        error={error}
        helperText={helperText}
        sx={{ minWidth: 200 }}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem value={ADD_NEW_CATEGORY_VALUE}>+ Agregar concepto</MenuItem>
      </TextField>
      <AddCategoryDialog
        kind={kind}
        open={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onCreated={(categoryId) => {
          onChange(categoryId)
          setIsAddCategoryOpen(false)
        }}
      />
    </>
  )
}

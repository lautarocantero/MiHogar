import { Chip, MenuItem, TextField } from '@mui/material'
import { useAppSelector } from '@/store/hooks'
import { selectAllTaskCategories } from '@/store/taskCategories/taskCategoriesSelectors'

const MAX_CATEGORIES_PER_TASK = 10

export function TaskCategoryPicker({
  value,
  onChange
}: {
  value: string[]
  onChange: (categoryIds: string[]) => void
}): React.JSX.Element {
  const categories = useAppSelector(selectAllTaskCategories)

  return (
    <TextField
      fullWidth
      select
      label="Categorías"
      slotProps={{ select: { multiple: true, renderValue: () => null } }}
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value as unknown as string[]
        onChange(nextValue.slice(0, MAX_CATEGORIES_PER_TASK))
      }}
      helperText={value.length >= MAX_CATEGORIES_PER_TASK ? 'Máximo 10 categorías' : ' '}
    >
      {categories.map((category) => (
        <MenuItem key={category.id} value={category.id}>
          <Chip
            label={category.label}
            size="small"
            sx={{
              backgroundColor: category.color,
              color: '#fffdf9',
              mr: 1,
              opacity: value.includes(category.id) ? 1 : 0.45
            }}
          />
        </MenuItem>
      ))}
    </TextField>
  )
}

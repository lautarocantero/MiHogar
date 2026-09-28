import { Chip, Stack } from '@mui/material'
import { useAppSelector } from '@/store/hooks'
import { selectAllTaskCategories } from '@/store/taskCategories/taskCategoriesSelectors'

export function TaskCategoryChips({
  categoryIds
}: {
  categoryIds: string[]
}): React.JSX.Element | null {
  const allCategories = useAppSelector(selectAllTaskCategories)
  const categories = allCategories.filter((category) => categoryIds.includes(category.id))

  if (categories.length === 0) {
    return null
  }

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.label}
          size="small"
          sx={{ backgroundColor: category.color, color: '#fffdf9', fontSize: '0.65rem' }}
        />
      ))}
    </Stack>
  )
}

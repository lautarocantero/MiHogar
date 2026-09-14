import { Chip, Stack } from '@mui/material'
import { organicColors } from '@/theme/tokens'

export function CalendarLegend(): React.JSX.Element {
  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      useFlexGap
      aria-label="Referencias del calendario"
    >
      <Chip
        label="Pago por vencer"
        size="small"
        sx={{
          backgroundColor: organicColors.orange.tint,
          color: organicColors.orange.dark,
          border: `1px solid ${organicColors.orange.main}`
        }}
      />
      <Chip
        label="Entra dinero"
        size="small"
        sx={{ backgroundColor: organicColors.sage.tint, color: organicColors.sage.dark }}
      />
      <Chip
        label="Ya pagado"
        size="small"
        sx={{
          backgroundColor: organicColors.neutral.border,
          color: organicColors.neutral.textSecondary
        }}
      />
    </Stack>
  )
}

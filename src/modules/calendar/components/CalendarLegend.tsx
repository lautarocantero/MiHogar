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
          backgroundColor: organicColors.overdue.tint,
          color: organicColors.overdue.main,
          border: `1px solid ${organicColors.overdue.border}`
        }}
      />
      <Chip
        label="Entra dinero"
        size="small"
        sx={{
          backgroundColor: organicColors.income.tint,
          color: organicColors.income.main,
          border: `1px solid ${organicColors.income.border}`
        }}
      />
      <Chip
        label="Ya pagado"
        size="small"
        sx={{
          backgroundColor: organicColors.paid.tint,
          color: organicColors.paid.main,
          border: `1px solid ${organicColors.paid.border}`
        }}
      />
      <Chip
        label="Periodo de pago de tarjeta"
        size="small"
        sx={{
          backgroundColor: organicColors.violet.tint,
          color: organicColors.violet.dark,
          border: `1px solid ${organicColors.violet.border}`
        }}
      />
    </Stack>
  )
}

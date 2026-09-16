import { Stack, TextField } from '@mui/material'
import type { MonthComparisonPickerProps } from '../typings/props'

export function MonthComparisonPicker({
  monthAKey,
  monthBKey,
  onChangeMonthA,
  onChangeMonthB
}: MonthComparisonPickerProps): React.JSX.Element {
  return (
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      <TextField
        label="Mes A"
        type="month"
        value={monthAKey}
        onChange={(event) => onChangeMonthA(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        label="Mes B"
        type="month"
        value={monthBKey}
        onChange={(event) => onChangeMonthB(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />
    </Stack>
  )
}

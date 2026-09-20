import { Box } from '@mui/material'
import { MonthGridCell } from './MonthGridCell'
import type { MonthGridProps } from '../typings/props'

export function MonthGrid({
  weeks,
  selectedDate,
  highlightedDate,
  onSelectDate
}: MonthGridProps): React.JSX.Element {
  return (
    <Box role="grid" aria-label="Calendario del mes" sx={{ width: '100%' }}>
      {weeks.map((week) => (
        <Box key={week[0].isoDate} role="row" sx={{ display: 'flex' }}>
          {week.map((day) => (
            <Box key={day.isoDate} role="gridcell" sx={{ width: '14.28%', p: 0.5 }}>
              <MonthGridCell
                day={day}
                isSelected={day.isoDate === selectedDate}
                isHighlighted={day.isoDate === highlightedDate}
                onSelect={() => onSelectDate(day.isoDate)}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

import { Box } from '@mui/material'
import { MonthGridCell } from './MonthGridCell'
import type { MonthGridProps } from '../typings/props'

export function MonthGrid({ weeks }: MonthGridProps): React.JSX.Element {
  return (
    <Box
      component="table"
      role="grid"
      aria-label="Calendario del mes"
      sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 1 }}
    >
      <tbody>
        {weeks.map((week) => (
          <Box component="tr" key={week[0].isoDate} role="row">
            {week.map((day) => (
              <Box
                component="td"
                key={day.isoDate}
                role="gridcell"
                sx={{ width: '14.28%', p: 0.5 }}
              >
                <MonthGridCell day={day} />
              </Box>
            ))}
          </Box>
        ))}
      </tbody>
    </Box>
  )
}

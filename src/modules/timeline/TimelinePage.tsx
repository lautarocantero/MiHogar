import { Stack, Typography } from '@mui/material'
import { TimelineSummaryCards } from './components/TimelineSummaryCards'
import { TimelineEntryCard } from './components/TimelineEntryCard'
import { useTimelineData } from './useTimelineData'

export function TimelinePage(): React.JSX.Element {
  const { summary, entries } = useTimelineData()

  return (
    <Stack spacing={4} component="section" aria-label="Línea de tiempo">
      <TimelineSummaryCards summary={summary} />

      {entries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Todavía no hay movimientos para mostrar acá.
        </Typography>
      ) : (
        <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {entries.map((entry) => (
            <TimelineEntryCard key={entry.movement.id} entry={entry} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}

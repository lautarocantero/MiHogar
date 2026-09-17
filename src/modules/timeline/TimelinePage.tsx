import { useState } from 'react'
import { Button, Stack, TextField, Typography } from '@mui/material'
import type { Movement } from '@/typings/domain/types'
import { TimelineSummaryCards } from './components/TimelineSummaryCards'
import { TimelineEntryCard } from './components/TimelineEntryCard'
import { EditMovementDialog } from './components/EditMovementDialog'
import { DeleteMovementDialog } from './components/DeleteMovementDialog'
import { useTimelineData } from './useTimelineData'
import type { TimelineRange } from './typings/types'

const DEFAULT_RANGE: TimelineRange = { from: null, to: null }

export function TimelinePage(): React.JSX.Element {
  const [range, setRange] = useState<TimelineRange>(DEFAULT_RANGE)
  const { summary, entries } = useTimelineData(range)
  const [editingMovement, setEditingMovement] = useState<Movement | null>(null)
  const [deletingMovement, setDeletingMovement] = useState<Movement | null>(null)
  const hasCustomRange = Boolean(range.from || range.to)

  return (
    <Stack spacing={4} component="section" aria-label="Línea de tiempo">
      <TimelineSummaryCards summary={summary} />

      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        <TextField
          label="Desde"
          type="date"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={range.from ?? ''}
          onChange={(event) => setRange((prev) => ({ ...prev, from: event.target.value || null }))}
        />
        <TextField
          label="Hasta"
          type="date"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={range.to ?? ''}
          onChange={(event) => setRange((prev) => ({ ...prev, to: event.target.value || null }))}
        />
        {hasCustomRange && (
          <Button size="small" onClick={() => setRange(DEFAULT_RANGE)}>
            Limpiar filtro
          </Button>
        )}
      </Stack>

      {entries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Todavía no hay movimientos para mostrar acá.
        </Typography>
      ) : (
        <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {entries.map((entry) => (
            <TimelineEntryCard
              key={entry.movement.id}
              entry={entry}
              onEdit={() => setEditingMovement(entry.movement)}
              onDelete={() => setDeletingMovement(entry.movement)}
            />
          ))}
        </Stack>
      )}

      {editingMovement && (
        <EditMovementDialog
          movement={editingMovement}
          open={Boolean(editingMovement)}
          onClose={() => setEditingMovement(null)}
        />
      )}
      {deletingMovement && (
        <DeleteMovementDialog
          movement={deletingMovement}
          open={Boolean(deletingMovement)}
          onClose={() => setDeletingMovement(null)}
        />
      )}
    </Stack>
  )
}

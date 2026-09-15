import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import type { Movement } from '@/typings/domain/types'
import { TimelineSummaryCards } from './components/TimelineSummaryCards'
import { TimelineEntryCard } from './components/TimelineEntryCard'
import { EditMovementDialog } from './components/EditMovementDialog'
import { DeleteMovementDialog } from './components/DeleteMovementDialog'
import { useTimelineData } from './useTimelineData'

export function TimelinePage(): React.JSX.Element {
  const { summary, entries } = useTimelineData()
  const [editingMovement, setEditingMovement] = useState<Movement | null>(null)
  const [deletingMovement, setDeletingMovement] = useState<Movement | null>(null)

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

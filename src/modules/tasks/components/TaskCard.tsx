import { Box, Chip, Stack, Typography } from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import NotesIcon from '@mui/icons-material/Notes'
import { organicColors } from '@/theme/tokens'
import { TaskSeverity } from '@/typings/domain/enums'
import { TaskCategoryChips } from './TaskCategoryChips'
import type { TaskCardProps } from '../typings/props'

const SEVERITY_BARS: Record<TaskSeverity, number> = {
  [TaskSeverity.LOW]: 1,
  [TaskSeverity.MEDIUM]: 2,
  [TaskSeverity.HIGH]: 3,
  [TaskSeverity.CRITICAL]: 4
}

const SEVERITY_COLOR: Record<TaskSeverity, string> = {
  [TaskSeverity.LOW]: organicColors.neutral.border,
  [TaskSeverity.MEDIUM]: organicColors.blue.main,
  [TaskSeverity.HIGH]: organicColors.orange.main,
  [TaskSeverity.CRITICAL]: organicColors.overdue.main
}

function SeverityBars({ severity }: { severity: TaskSeverity }): React.JSX.Element {
  const active = SEVERITY_BARS[severity]
  const color = SEVERITY_COLOR[severity]
  return (
    <Stack direction="row" spacing={0.5} aria-label={`Severidad: ${severity}`}>
      {[1, 2, 3, 4].map((bar) => (
        <Box
          key={bar}
          sx={{
            width: 6,
            height: 14,
            borderRadius: 1,
            backgroundColor: bar <= active ? color : organicColors.neutral.border
          }}
        />
      ))}
    </Stack>
  )
}

export function TaskCard({ task, onOpen, onMoveWithKeyboard }: TaskCardProps): React.JSX.Element {
  const checklistDone = task.checklist.filter((item) => item.done).length

  return (
    <Box
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(event) => event.dataTransfer.setData('text/plain', task.id)}
      onClick={() => onOpen(task)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(task)
        }
        if (event.altKey && event.key === 'ArrowRight') {
          onMoveWithKeyboard(task, 1)
        }
        if (event.altKey && event.key === 'ArrowLeft') {
          onMoveWithKeyboard(task, -1)
        }
      }}
      sx={{
        p: 1.5,
        mb: 1.25,
        borderRadius: 1,
        backgroundColor: organicColors.surface,
        border: `1px solid ${organicColors.neutral.border}`,
        cursor: 'pointer',
        '&:focus-visible': { outline: `2px solid ${organicColors.orange.main}` }
      }}
    >
      <Stack spacing={0.75}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip label={task.key} size="small" sx={{ fontSize: '0.7rem' }} />
          <SeverityBars severity={task.severity} />
        </Stack>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{task.title}</Typography>
        <TaskCategoryChips categoryIds={task.categoryIds} />
        {(task.gates.merged || task.gates.approved) && (
          <Stack direction="row" spacing={0.5}>
            {task.gates.merged && <Chip label="Mergeado" size="small" color="secondary" />}
            {task.gates.approved && <Chip label="Aprobado" size="small" color="success" />}
          </Stack>
        )}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {task.checklist.length > 0 && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ChecklistIcon sx={{ fontSize: 14, color: organicColors.neutral.textSecondary }} />
              <Typography variant="caption" color="text.secondary">
                {checklistDone}/{task.checklist.length}
              </Typography>
            </Stack>
          )}
          {task.notes.length > 0 && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <NotesIcon sx={{ fontSize: 14, color: organicColors.neutral.textSecondary }} />
              <Typography variant="caption" color="text.secondary">
                {task.notes.length}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

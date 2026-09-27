import { useState } from 'react'
import { Box, Stack, TextField, Typography } from '@mui/material'
import { organicColors, organicTypography } from '@/theme/tokens'
import { TaskCard } from './TaskCard'
import type { TaskColumnProps } from '../typings/props'

export function TaskColumn({
  status,
  tasks,
  onOpenTask,
  onQuickAdd,
  onDropTask,
  onMoveWithKeyboard
}: TaskColumnProps): React.JSX.Element {
  const [quickTitle, setQuickTitle] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const sorted = [...tasks].sort((a, b) => a.rank - b.rank)

  return (
    <Stack
      spacing={1}
      sx={{
        minWidth: 260,
        width: 260,
        flexShrink: 0,
        p: 1.25,
        borderRadius: 1.5,
        backgroundColor: isDragOver ? organicColors.orange.tint : 'transparent',
        border: isDragOver ? `1px dashed ${organicColors.orange.main}` : '1px solid transparent'
      }}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragOver(false)
        const taskId = event.dataTransfer.getData('text/plain')
        if (taskId) {
          const lastTask = sorted[sorted.length - 1]
          onDropTask(taskId, undefined, lastTask?.id)
        }
      }}
    >
      <Typography
        sx={{
          fontFamily: organicTypography.titleFontFamily,
          fontSize: '0.95rem',
          color: organicColors.brown.dark
        }}
      >
        {status.label} · {tasks.length}
      </Typography>

      {onQuickAdd && (
        <TextField
          size="small"
          placeholder="Nueva tarea…"
          value={quickTitle}
          onChange={(event) => setQuickTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && quickTitle.trim()) {
              onQuickAdd(quickTitle.trim())
              setQuickTitle('')
            }
          }}
        />
      )}

      <Box>
        {sorted.map((task, index) => (
          <Box
            key={task.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              event.stopPropagation()
              const taskId = event.dataTransfer.getData('text/plain')
              if (taskId) {
                const before = sorted[index - 1]
                onDropTask(taskId, before?.id, task.id)
              }
            }}
          >
            <TaskCard task={task} onOpen={onOpenTask} onMoveWithKeyboard={onMoveWithKeyboard} />
          </Box>
        ))}
      </Box>
    </Stack>
  )
}

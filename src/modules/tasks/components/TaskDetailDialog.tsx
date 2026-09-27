import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { v4 as uuidv4 } from 'uuid'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { suggestBranchName } from '@/utils/domain/suggestBranchName'
import { useUpdateTask } from '../useUpdateTask'
import { useArchiveTask } from '../useArchiveTask'
import { TaskCategoryPicker } from './TaskCategoryPicker'
import { TaskLinksSection } from './TaskLinksSection'
import type { TaskDetailDialogProps } from '../typings/props'

export function TaskDetailDialog({
  task,
  onClose
}: TaskDetailDialogProps): React.JSX.Element | null {
  const updateTask = useUpdateTask()
  const { archive, restore } = useArchiveTask()
  const [checklistDraft, setChecklistDraft] = useState('')
  const [noteDraft, setNoteDraft] = useState('')

  if (!task) {
    return null
  }

  const branchName = suggestBranchName(task.seq, task.title)

  return (
    <Dialog
      open={Boolean(task)}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="task-detail-title"
    >
      <DialogHeader id="task-detail-title" onClose={onClose}>
        {task.key} · {task.title}
      </DialogHeader>
      <DialogContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Rama sugerida: {branchName}
            </Typography>
            <IconButton
              size="small"
              aria-label="Copiar nombre de rama"
              onClick={() => navigator.clipboard.writeText(branchName)}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Stack>

          <TextField
            fullWidth
            label="Descripción"
            multiline
            minRows={3}
            value={task.description}
            onChange={(event) => updateTask(task, { description: event.target.value })}
          />

          <TaskCategoryPicker
            value={task.categoryIds}
            onChange={(categoryIds) => updateTask(task, { categoryIds })}
          />

          <TaskLinksSection task={task} />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Fecha de inicio"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={task.startDate ?? ''}
              onChange={(event) => updateTask(task, { startDate: event.target.value || undefined })}
            />
            <TextField
              label="Fecha límite"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={task.dueDate ?? ''}
              onChange={(event) => updateTask(task, { dueDate: event.target.value || undefined })}
            />
          </Stack>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Checklist
            </Typography>
            <List dense disablePadding>
              {task.checklist.map((item) => (
                <ListItem
                  key={item.id}
                  disableGutters
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label="Borrar ítem"
                      onClick={() =>
                        updateTask(task, {
                          checklist: task.checklist.filter((candidate) => candidate.id !== item.id)
                        })
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={item.done}
                      onChange={(event) =>
                        updateTask(task, {
                          checklist: task.checklist.map((candidate) =>
                            candidate.id === item.id
                              ? { ...candidate, done: event.target.checked }
                              : candidate
                          )
                        })
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                fullWidth
                placeholder="Agregar ítem…"
                value={checklistDraft}
                onChange={(event) => setChecklistDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && checklistDraft.trim()) {
                    updateTask(task, {
                      checklist: [
                        ...task.checklist,
                        { id: uuidv4(), text: checklistDraft.trim(), done: false }
                      ]
                    })
                    setChecklistDraft('')
                  }
                }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Notas
            </Typography>
            <Stack spacing={1}>
              {task.notes.map((note) => (
                <Box
                  key={note.id}
                  sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {note.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Agregar nota…"
                multiline
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
              />
              <Button
                variant="outlined"
                disabled={!noteDraft.trim()}
                onClick={() => {
                  updateTask(task, {
                    notes: [
                      ...task.notes,
                      { id: uuidv4(), text: noteDraft.trim(), createdAt: new Date().toISOString() }
                    ]
                  })
                  setNoteDraft('')
                }}
              >
                Agregar
              </Button>
            </Stack>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            {task.archivedAt ? (
              <Button variant="outlined" onClick={() => restore(task)}>
                Restaurar
              </Button>
            ) : (
              <Button variant="outlined" color="error" onClick={() => archive(task)}>
                Archivar
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

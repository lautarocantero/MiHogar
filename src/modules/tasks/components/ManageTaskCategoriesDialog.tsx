import { useState } from 'react'
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { useTaskCategories } from '../useTaskCategories'

const COLOR_OPTIONS = ['#f87171', '#818cf8', '#34d399', '#94a3b8', '#fbbf24', '#38bdf8', '#a78bfa']

export function ManageTaskCategoriesDialog({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}): React.JSX.Element {
  const { categories, create, remove } = useTaskCategories()
  const [label, setLabel] = useState('')
  const [color, setColor] = useState(COLOR_OPTIONS[0])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="task-categories-title"
    >
      <DialogHeader id="task-categories-title" onClose={onClose}>
        Categorías de tareas
      </DialogHeader>
      <DialogContent>
        <Stack spacing={2}>
          <List dense disablePadding>
            {categories.map((category) => (
              <ListItem
                key={category.id}
                disableGutters
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    aria-label="Borrar categoría"
                    onClick={() => remove(category.id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Chip
                      label={category.label}
                      size="small"
                      sx={{ backgroundColor: category.color, color: '#fffdf9' }}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              fullWidth
              placeholder="Nueva categoría…"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
            <Stack direction="row" spacing={0.5}>
              {COLOR_OPTIONS.map((option) => (
                <Stack
                  key={option}
                  component="button"
                  type="button"
                  onClick={() => setColor(option)}
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: option,
                    border: option === color ? '2px solid #333' : '2px solid transparent',
                    cursor: 'pointer',
                    p: 0
                  }}
                />
              ))}
            </Stack>
            <Button
              variant="outlined"
              disabled={!label.trim()}
              onClick={() => {
                create({ label: label.trim(), color })
                setLabel('')
              }}
            >
              Agregar
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

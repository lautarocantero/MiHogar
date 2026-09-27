import { useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { organicColors } from '@/theme/tokens'
import type { Task, TaskLink } from '@/typings/domain/types'
import { useAddTaskLink } from '../useAddTaskLink'
import { useRemoveTaskLink } from '../useRemoveTaskLink'

const LINK_STATE_COLOR: Record<string, string> = {
  open: organicColors.sage.main,
  draft: organicColors.neutral.textSecondary,
  merged: organicColors.violet.main,
  closed: organicColors.overdue.main
}

function linkLabel(link: TaskLink): string {
  const kind = link.type === 'pr' ? 'PR' : 'Issue'
  return `${kind} ${link.repo}#${link.number}`
}

export function TaskLinksSection({ task }: { task: Task }): React.JSX.Element {
  const [url, setUrl] = useState('')
  const { error, addLink } = useAddTaskLink(task)
  const removeLink = useRemoveTaskLink()

  const handlePaste = (value: string): void => {
    setUrl(value)
    if (value.trim().startsWith('https://github.com/')) {
      const added = addLink(value.trim())
      if (added) {
        setUrl('')
      }
    }
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        GitHub
      </Typography>
      <List dense disablePadding>
        {task.links.map((link) => (
          <ListItem
            key={link.id}
            disableGutters
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                aria-label="Quitar vínculo"
                onClick={() => removeLink(task, link.id)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            }
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={linkLabel(link)}
                size="small"
                sx={{
                  backgroundColor:
                    LINK_STATE_COLOR[link.state ?? ''] ?? organicColors.neutral.border,
                  color: '#fffdf9'
                }}
              />
              {link.syncError && (
                <Typography variant="caption" color="error">
                  No se pudo leer GitHub
                </Typography>
              )}
              <Link href={link.url} target="_blank" rel="noreferrer" sx={{ display: 'flex' }}>
                <OpenInNewIcon fontSize="small" />
              </Link>
            </Stack>
          </ListItem>
        ))}
      </List>
      <TextField
        size="small"
        fullWidth
        placeholder="Pegar link de PR o issue de GitHub…"
        value={url}
        onChange={(event) => handlePaste(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && url.trim()) {
            const added = addLink(url.trim())
            if (added) {
              setUrl('')
            }
          }
        }}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}

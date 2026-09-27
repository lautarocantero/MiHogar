import { Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import type { ArchivedTasksListProps } from '../typings/props'

export function ArchivedTasksList({ tasks, onRestore }: ArchivedTasksListProps): React.JSX.Element {
  if (tasks.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hay tareas archivadas.
      </Typography>
    )
  }

  return (
    <List dense>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          secondaryAction={
            <Button size="small" onClick={() => onRestore(task)}>
              Restaurar
            </Button>
          }
        >
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <Typography component="span" variant="body2" color="text.secondary">
                  {task.key}
                </Typography>
                <Typography component="span" variant="body2">
                  {task.title}
                </Typography>
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  )
}

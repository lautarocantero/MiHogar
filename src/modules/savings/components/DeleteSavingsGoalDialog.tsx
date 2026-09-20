import { Alert, Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { useDeleteSavingsGoal } from '../useDeleteSavingsGoal'
import type { DeleteSavingsGoalDialogProps } from '../typings/props'

export function DeleteSavingsGoalDialog({
  goal,
  open,
  onClose,
  onDeleted
}: DeleteSavingsGoalDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useDeleteSavingsGoal(goal, onDeleted)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-savings-goal-title"
    >
      <DialogHeader id="delete-savings-goal-title" onClose={onClose}>
        Eliminar &quot;{goal.name}&quot;
      </DialogHeader>
      <DialogContent>
        <Stack spacing={2}>{errorMessage && <Alert severity="error">{errorMessage}</Alert>}</Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={submit} color="error" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Eliminando…' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

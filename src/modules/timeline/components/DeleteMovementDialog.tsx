import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useDeleteMovement } from '../useDeleteMovement'
import type { DeleteMovementDialogProps } from '../typings/props'

export function DeleteMovementDialog({
  movement,
  open,
  onClose
}: DeleteMovementDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useDeleteMovement(movement, onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-movement-title"
    >
      <DialogTitle id="delete-movement-title">Eliminar movimiento</DialogTitle>
      <DialogContent>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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

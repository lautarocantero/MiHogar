import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { EditMovementForm } from './EditMovementForm'
import { useUpdateMovement } from '../useUpdateMovement'
import type { EditMovementDialogProps } from '../typings/props'

export function EditMovementDialog({
  movement,
  open,
  onClose
}: EditMovementDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useUpdateMovement(movement, onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-movement-title"
    >
      <DialogTitle id="edit-movement-title">Editar movimiento</DialogTitle>
      <DialogContent>
        <EditMovementForm
          movement={movement}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}

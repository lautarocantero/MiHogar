import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
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
      <DialogHeader id="edit-movement-title" onClose={onClose}>
        Editar movimiento
      </DialogHeader>
      <DialogContent>
        <EditMovementForm
          movement={movement}
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}

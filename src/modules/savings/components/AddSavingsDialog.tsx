import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { AddSavingsForm } from './AddSavingsForm'
import { useCreateSavings } from '../useCreateSavings'
import type { AddSavingsDialogProps } from '../typings/props'

export function AddSavingsDialog({ open, onClose }: AddSavingsDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreateSavings(onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="add-savings-title"
    >
      <DialogHeader id="add-savings-title" onClose={onClose}>
        Agregar un ahorro
      </DialogHeader>
      <DialogContent>
        <AddSavingsForm
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}

import { Dialog, DialogContent, DialogTitle } from '@mui/material'
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
      maxWidth="sm"
      aria-labelledby="add-savings-title"
    >
      <DialogTitle id="add-savings-title">Agregar un ahorro</DialogTitle>
      <DialogContent>
        <AddSavingsForm onSubmit={submit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
      </DialogContent>
    </Dialog>
  )
}

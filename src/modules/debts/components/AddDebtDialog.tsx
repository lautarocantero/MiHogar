import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { AddDebtForm } from './AddDebtForm'
import { useCreateDebt } from '../useCreateDebt'
import type { AddDebtDialogProps } from '../typings/props'

export function AddDebtDialog({ open, onClose }: AddDebtDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreateDebt(onClose)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="add-debt-title">
      <DialogHeader id="add-debt-title" onClose={onClose}>
        Agregar una deuda o préstamo
      </DialogHeader>
      <DialogContent>
        <AddDebtForm
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}

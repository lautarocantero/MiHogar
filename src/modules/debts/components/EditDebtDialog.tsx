import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { EditDebtForm } from './EditDebtForm'
import { useUpdateDebt } from '../useUpdateDebt'
import type { EditDebtDialogProps } from '../typings/props'
import { useFullScreenDialog } from '@/hooks/shared/useResponsive'

export function EditDebtDialog({ debt, open, onClose }: EditDebtDialogProps): React.JSX.Element {
  const fullScreen = useFullScreenDialog()
  const { submit, isSubmitting, errorMessage } = useUpdateDebt(debt, onClose)

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-debt-title"
    >
      <DialogHeader id="edit-debt-title" onClose={onClose}>
        Editar &quot;{debt.name}&quot;
      </DialogHeader>
      <DialogContent>
        <EditDebtForm
          debt={debt}
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}

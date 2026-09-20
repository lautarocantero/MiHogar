import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { AddSavingsGoalForm } from './AddSavingsGoalForm'
import { useCreateSavingsGoal } from '../useCreateSavingsGoal'
import type { AddSavingsGoalDialogProps } from '../typings/props'

export function AddSavingsGoalDialog({
  open,
  onClose
}: AddSavingsGoalDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreateSavingsGoal(onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="add-savings-goal-title"
    >
      <DialogHeader id="add-savings-goal-title" onClose={onClose}>
        Agregar una meta de ahorro
      </DialogHeader>
      <DialogContent>
        <AddSavingsGoalForm
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}

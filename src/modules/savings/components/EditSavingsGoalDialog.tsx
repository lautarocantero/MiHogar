import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { EditSavingsGoalForm } from './EditSavingsGoalForm'
import { useUpdateSavingsGoal } from '../useUpdateSavingsGoal'
import type { EditSavingsGoalDialogProps } from '../typings/props'
import { useFullScreenDialog } from '@/hooks/shared/useResponsive'

export function EditSavingsGoalDialog({
  goal,
  open,
  onClose
}: EditSavingsGoalDialogProps): React.JSX.Element {
  const fullScreen = useFullScreenDialog()
  const { submit, isSubmitting, errorMessage } = useUpdateSavingsGoal(goal, onClose)

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-savings-goal-title"
    >
      <DialogHeader id="edit-savings-goal-title" onClose={onClose}>
        Editar &quot;{goal.name}&quot;
      </DialogHeader>
      <DialogContent>
        <EditSavingsGoalForm
          goal={goal}
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}

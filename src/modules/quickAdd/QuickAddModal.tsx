import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { QuickAddStep } from './typings/enums'
import { StepChooseType } from './steps/StepChooseType'
import { StepAmountAndDetails } from './steps/StepAmountAndDetails'
import { useQuickAddForm } from './useQuickAddForm'
import type { QuickAddModalProps } from './typings/props'

export function QuickAddModal({ open, onClose }: QuickAddModalProps): React.JSX.Element {
  const { step, chooseType, goBackToChooseType, submit, isSubmitting, errorMessage, selectedType } =
    useQuickAddForm(onClose)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="quick-add-title">
      <DialogTitle id="quick-add-title">Anotar movimiento</DialogTitle>
      <DialogContent>
        {step === QuickAddStep.CHOOSE_TYPE && <StepChooseType onChoose={chooseType} />}
        {step === QuickAddStep.AMOUNT_AND_DETAILS && selectedType && (
          <StepAmountAndDetails
            type={selectedType}
            onSubmit={submit}
            onBack={goBackToChooseType}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

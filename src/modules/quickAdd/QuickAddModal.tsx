import { Chip, DialogContent, Dialog } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
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
      <DialogHeader id="quick-add-title" onClose={onClose}>
        Anotar movimiento
      </DialogHeader>
      <DialogContent>
        <Chip
          size="small"
          label="Para gastos e ingresos puntuales. Para pagos fijos o recurrentes, usá Pagos y Servicios."
          sx={{ mb: 2, height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 } }}
        />
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

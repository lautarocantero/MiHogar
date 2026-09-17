import { Chip, DialogContent, Dialog } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { MovementType, PaymentKind } from '@/typings/domain/enums'
import { AddPaymentForm } from '@/modules/payments/components/AddPaymentForm'
import { useCreatePayment } from '@/modules/payments/useCreatePayment'
import { QuickAddStep } from './typings/enums'
import { StepChooseType } from './steps/StepChooseType'
import { StepChooseFrequency } from './steps/StepChooseFrequency'
import { StepAmountAndDetails } from './steps/StepAmountAndDetails'
import { useQuickAddForm } from './useQuickAddForm'
import type { QuickAddModalProps } from './typings/props'

export function QuickAddModal({ open, onClose }: QuickAddModalProps): React.JSX.Element {
  const {
    step,
    selectedType,
    chooseType,
    chooseOneOff,
    chooseRecurring,
    goBack,
    submit,
    isSubmitting,
    errorMessage
  } = useQuickAddForm(onClose)

  const recurringKind =
    selectedType === MovementType.INCOME ? PaymentKind.DEPOSIT : PaymentKind.EXPENSE
  const {
    submit: submitPayment,
    isSubmitting: isSubmittingPayment,
    errorMessage: paymentErrorMessage
  } = useCreatePayment(recurringKind, onClose)

  const isRecurringStep = step === QuickAddStep.RECURRING_DETAILS

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isRecurringStep ? 'lg' : 'sm'}
      aria-labelledby="quick-add-title"
    >
      <DialogHeader id="quick-add-title" onClose={onClose}>
        Nuevo movimiento
      </DialogHeader>
      <DialogContent>
        <Chip
          size="small"
          label="Registrá cualquier pago, cobro o depósito, único o recurrente, desde acá."
          sx={{ mb: 2, height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 } }}
        />
        {step === QuickAddStep.CHOOSE_TYPE && <StepChooseType onChoose={chooseType} />}
        {step === QuickAddStep.CHOOSE_FREQUENCY && selectedType && (
          <StepChooseFrequency
            type={selectedType}
            onChooseOneOff={chooseOneOff}
            onChooseRecurring={chooseRecurring}
            onBack={goBack}
          />
        )}
        {step === QuickAddStep.AMOUNT_AND_DETAILS && selectedType && (
          <StepAmountAndDetails
            type={selectedType}
            onSubmit={submit}
            onBack={goBack}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
          />
        )}
        {isRecurringStep && selectedType && (
          <AddPaymentForm
            kind={recurringKind}
            onSubmit={submitPayment}
            onCancel={goBack}
            cancelLabel="Volver"
            isSubmitting={isSubmittingPayment}
            errorMessage={paymentErrorMessage}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

import { DialogContent, Dialog, Typography } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { organicColors, organicTypography } from '@/theme/tokens'
import { MovementType, PaymentKind } from '@/typings/domain/enums'
import { AddPaymentForm } from '@/modules/payments/components/AddPaymentForm'
import { useCreatePayment } from '@/modules/payments/useCreatePayment'
import { QuickAddStep } from './typings/enums'
import { StepChooseType } from './steps/StepChooseType'
import { StepChooseFrequency } from './steps/StepChooseFrequency'
import { StepAmountAndDetails } from './steps/StepAmountAndDetails'
import { StepCardPaymentDetails } from './steps/StepCardPaymentDetails'
import { StepIncomeDetails } from './steps/StepIncomeDetails'
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
  const isDetailsStep = step === QuickAddStep.AMOUNT_AND_DETAILS

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isRecurringStep || isDetailsStep ? 'lg' : 'sm'}
      aria-labelledby="quick-add-title"
    >
      <DialogHeader id="quick-add-title" onClose={onClose}>
        <Typography
          component="span"
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.75rem',
            fontWeight: 400,
            color: organicColors.orange.dark
          }}
        >
          Nuevo movimiento
        </Typography>
      </DialogHeader>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Registrá cualquier pago, cobro o depósito, único o recurrente, desde acá.
        </Typography>
        {step === QuickAddStep.CHOOSE_TYPE && <StepChooseType onChoose={chooseType} />}
        {step === QuickAddStep.CHOOSE_FREQUENCY && selectedType && (
          <StepChooseFrequency
            type={selectedType}
            onChooseOneOff={chooseOneOff}
            onChooseRecurring={chooseRecurring}
            onBack={goBack}
          />
        )}
        {step === QuickAddStep.AMOUNT_AND_DETAILS &&
          selectedType &&
          (selectedType === MovementType.CARD_PAYMENT ? (
            <StepCardPaymentDetails
              type={selectedType}
              onSubmit={submit}
              onBack={goBack}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          ) : selectedType === MovementType.INCOME ? (
            <StepIncomeDetails
              type={selectedType}
              onSubmit={submit}
              onBack={goBack}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          ) : (
            <StepAmountAndDetails
              type={selectedType}
              onSubmit={submit}
              onBack={goBack}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          ))}
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

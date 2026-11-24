import { useState } from 'react'
import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPaymentFormSchema } from '@/validation/addPaymentFormSchema'
import { AmountMode, OwnerType, PaymentFrequency, PaymentKind } from '@/typings/domain/enums'
import { LeafButton } from '@/components/shared/LeafButton'
import { PaymentFormFields } from './PaymentFormFields'
import type { AddPaymentFormProps } from '../typings/props'
import type { AddPaymentFormValues } from '../typings/types'
import { useT } from '@/i18n'

export function AddPaymentForm({
  kind,
  onSubmit,
  onCancel,
  cancelLabel,
  isSubmitting,
  errorMessage
}: AddPaymentFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors }
  } = useForm<AddPaymentFormValues>({
    resolver: zodResolver(addPaymentFormSchema),
    defaultValues: {
      concept: '',
      entity: '',
      accountId: '',
      categoryId: '',
      ownerType: OwnerType.HOUSEHOLD,
      ownerId: '',
      recurring: true,
      frequency: PaymentFrequency.MONTHLY,
      dueDate: '',
      amount: undefined,
      installmentsTotal: undefined,
      installmentsPaid: undefined,
      kind,
      amountMode: AmountMode.FIXED
    }
  })

  const selectedOwnerType = watch('ownerType')
  const isRecurring = watch('recurring')
  const selectedAmountMode = watch('amountMode')
  const [hasInstallments, setHasInstallments] = useState(false)

  const toggleInstallments = (checked: boolean): void => {
    setHasInstallments(checked)
    if (!checked) {
      setValue('installmentsTotal', undefined)
      setValue('installmentsPaid', undefined)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <PaymentFormFields
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
          selectedOwnerType={selectedOwnerType}
          isRecurring={isRecurring}
          kind={kind}
          selectedAmountMode={selectedAmountMode}
          hasInstallments={hasInstallments}
          onToggleInstallments={toggleInstallments}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            size="large"
            onClick={onCancel}
            disabled={isSubmitting}
            sx={{ borderRadius: 0 }}
          >
            {cancelLabel ?? t('common.cancel')}
          </Button>
          <LeafButton type="submit" size="large" disabled={isSubmitting}>
            {isSubmitting
              ? t('common.saving')
              : kind === PaymentKind.DEPOSIT
                ? t('payments.add.depositSubmit')
                : t('payments.add.paymentSubmit')}
          </LeafButton>
        </Stack>
      </Stack>
    </Box>
  )
}

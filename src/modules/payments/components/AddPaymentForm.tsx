import { useState } from 'react'
import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPaymentFormSchema } from '@/validation/addPaymentFormSchema'
import { AmountMode, OwnerType, PaymentFrequency, PaymentKind } from '@/typings/domain/enums'
import { PaymentFormFields } from './PaymentFormFields'
import type { AddPaymentFormProps } from '../typings/props'
import type { AddPaymentFormValues } from '../typings/types'

export function AddPaymentForm({
  kind,
  onSubmit,
  onCancel,
  cancelLabel = 'Cancelar',
  isSubmitting,
  errorMessage
}: AddPaymentFormProps): React.JSX.Element {
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
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting
              ? 'Guardando…'
              : kind === PaymentKind.DEPOSIT
                ? 'Agregar el depósito'
                : 'Agregar el pago'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

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
  isSubmitting,
  errorMessage
}: AddPaymentFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    control,
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
      amount: 0,
      kind,
      amountMode: AmountMode.FIXED
    }
  })

  const selectedOwnerType = watch('ownerType')
  const isRecurring = watch('recurring')
  const selectedAmountMode = watch('amountMode')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <PaymentFormFields
          register={register}
          control={control}
          errors={errors}
          selectedOwnerType={selectedOwnerType}
          isRecurring={isRecurring}
          kind={kind}
          selectedAmountMode={selectedAmountMode}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando…'
            : kind === PaymentKind.DEPOSIT
              ? 'Agregar el depósito'
              : 'Agregar el pago'}
        </Button>
      </Stack>
    </Box>
  )
}

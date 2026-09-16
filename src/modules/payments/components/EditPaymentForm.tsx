import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPaymentFormSchema } from '@/validation/addPaymentFormSchema'
import { AmountMode, PaymentFrequency, PaymentKind } from '@/typings/domain/enums'
import { PaymentFormFields } from './PaymentFormFields'
import type { EditPaymentFormProps } from '../typings/props'
import type { AddPaymentFormValues } from '../typings/types'

export function EditPaymentForm({
  payment,
  onSubmit,
  isSubmitting,
  errorMessage
}: EditPaymentFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddPaymentFormValues>({
    resolver: zodResolver(addPaymentFormSchema),
    defaultValues: {
      concept: payment.concept,
      entity: payment.entity,
      accountId: payment.accountId,
      categoryId: payment.categoryId,
      ownerType: payment.ownerType,
      ownerId: payment.ownerId ?? '',
      recurring: payment.recurring,
      frequency: payment.frequency ?? PaymentFrequency.MONTHLY,
      dueDate: payment.dueDate,
      amount: payment.amount,
      kind: payment.kind ?? PaymentKind.EXPENSE,
      amountMode: payment.amountMode ?? AmountMode.FIXED
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
          kind={payment.kind ?? PaymentKind.EXPENSE}
          selectedAmountMode={selectedAmountMode}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </Stack>
    </Box>
  )
}

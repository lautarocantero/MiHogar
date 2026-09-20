import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addAccountFormSchema } from '@/validation/addAccountFormSchema'
import { AccountType, Currency, OwnerType } from '@/typings/domain/enums'
import { AccountFormFields } from './AccountFormFields'
import type { AddAccountFormProps } from '../typings/props'
import type { AddAccountFormValues } from '../typings/types'

export function AddAccountForm({
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: AddAccountFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddAccountFormValues>({
    resolver: zodResolver(addAccountFormSchema),
    defaultValues: {
      name: '',
      type: AccountType.BANK,
      currency: Currency.ARS,
      ownerType: OwnerType.HOUSEHOLD,
      ownerId: '',
      balance: undefined,
      contextPhrase: '',
      sourceAccountId: '',
      creditLimit: undefined,
      usedAmount: undefined,
      closingDay: undefined,
      dueDay: undefined,
      nextClosingDay: undefined,
      nextDueDay: undefined,
      color: '#7a4a23'
    }
  })

  const selectedType = watch('type')
  const selectedOwnerType = watch('ownerType')
  const selectedCurrency = watch('currency')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <AccountFormFields
          register={register}
          control={control}
          errors={errors}
          selectedType={selectedType}
          selectedOwnerType={selectedOwnerType}
          selectedCurrency={selectedCurrency}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Agregar la cuenta'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

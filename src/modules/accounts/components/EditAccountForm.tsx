import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addAccountFormSchema } from '@/validation/addAccountFormSchema'
import { AccountFormFields } from './AccountFormFields'
import type { EditAccountFormProps } from '../typings/props'
import type { AddAccountFormValues } from '../typings/types'

export function EditAccountForm({
  account,
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: EditAccountFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddAccountFormValues>({
    resolver: zodResolver(addAccountFormSchema),
    defaultValues: {
      name: account.name,
      type: account.type,
      ownerType: account.ownerType,
      ownerId: account.ownerId ?? '',
      balance: account.balance,
      contextPhrase: account.contextPhrase ?? '',
      sourceAccountId: account.sourceAccountId ?? '',
      creditLimit: account.creditLimit,
      usedAmount: account.usedAmount,
      closingDay: account.closingDay,
      dueDay: account.dueDay,
      nextClosingDay: account.nextClosingDay,
      nextDueDay: account.nextDueDay
    }
  })

  const selectedType = watch('type')
  const selectedOwnerType = watch('ownerType')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <AccountFormFields
          register={register}
          control={control}
          errors={errors}
          selectedType={selectedType}
          selectedOwnerType={selectedOwnerType}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

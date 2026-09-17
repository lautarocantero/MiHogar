import { useState } from 'react'
import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDebtFormSchema } from '@/validation/addDebtFormSchema'
import { DebtDirection, OwnerType } from '@/typings/domain/enums'
import { DebtFormFields } from './DebtFormFields'
import type { AddDebtFormProps } from '../typings/props'
import type { AddDebtFormValues } from '../typings/types'

export function AddDebtForm({
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: AddDebtFormProps): React.JSX.Element {
  const [hasInstallments, setHasInstallments] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddDebtFormValues>({
    resolver: zodResolver(addDebtFormSchema),
    defaultValues: {
      direction: DebtDirection.OWED_BY_HOUSEHOLD,
      name: '',
      counterparty: '',
      principal: undefined,
      outstandingBalance: undefined,
      rateAnnual: undefined,
      installmentAmount: undefined,
      installmentsTotal: undefined,
      installmentsPaid: undefined,
      nextInstallmentDate: '',
      startDate: '',
      ownerType: OwnerType.HOUSEHOLD,
      ownerId: '',
      reminderEnabled: true,
      notes: ''
    }
  })

  const selectedOwnerType = watch('ownerType')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <DebtFormFields
          register={register}
          control={control}
          errors={errors}
          selectedOwnerType={selectedOwnerType}
          hasInstallments={hasInstallments}
          onToggleInstallments={setHasInstallments}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Agregar'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

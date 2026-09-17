import { useState } from 'react'
import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDebtFormSchema } from '@/validation/addDebtFormSchema'
import { DebtFormFields } from './DebtFormFields'
import type { EditDebtFormProps } from '../typings/props'
import type { AddDebtFormValues } from '../typings/types'

export function EditDebtForm({
  debt,
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: EditDebtFormProps): React.JSX.Element {
  const [hasInstallments, setHasInstallments] = useState(Boolean(debt.installmentsTotal))
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddDebtFormValues>({
    resolver: zodResolver(addDebtFormSchema),
    defaultValues: {
      direction: debt.direction,
      name: debt.name,
      counterparty: debt.counterparty,
      principal: debt.principal,
      outstandingBalance: debt.outstandingBalance,
      rateAnnual: debt.rateAnnual,
      installmentAmount: debt.installmentAmount,
      installmentsTotal: debt.installmentsTotal,
      installmentsPaid: debt.installmentsPaid,
      frequency: debt.frequency,
      nextInstallmentDate: debt.nextInstallmentDate ?? '',
      startDate: debt.startDate ?? '',
      ownerType: debt.ownerType,
      ownerId: debt.ownerId ?? '',
      reminderEnabled: debt.reminderEnabled ?? true,
      notes: debt.notes ?? ''
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
            {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

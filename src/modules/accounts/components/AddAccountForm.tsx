import { Alert, Box, Button, MenuItem, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addAccountFormSchema } from '@/validation/addAccountFormSchema'
import { AccountType, OwnerType } from '@/typings/domain/enums'
import { resolveAccountTypeLabel } from '@/utils/domain/resolveAccountTypeLabel'
import { useAppSelector } from '@/store/hooks'
import { selectAllMembers } from '@/store/household/householdSelectors'
import type { AddAccountFormProps } from '../typings/props'
import type { AddAccountFormValues } from '../typings/types'

const ACCOUNT_TYPES = [AccountType.BANK, AccountType.CASH, AccountType.CREDIT_CARD]

export function AddAccountForm({
  onSubmit,
  isSubmitting,
  errorMessage
}: AddAccountFormProps): React.JSX.Element {
  const members = useAppSelector(selectAllMembers)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AddAccountFormValues>({
    resolver: zodResolver(addAccountFormSchema),
    defaultValues: {
      name: '',
      type: AccountType.BANK,
      ownerType: OwnerType.HOUSEHOLD,
      ownerId: '',
      balance: 0,
      contextPhrase: ''
    }
  })

  const selectedType = watch('type')
  const selectedOwnerType = watch('ownerType')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <TextField
          label="Nombre de la cuenta"
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        <TextField
          label="Tipo de cuenta"
          select
          {...register('type')}
          defaultValue={AccountType.BANK}
        >
          {ACCOUNT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {resolveAccountTypeLabel(type)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="¿De quién es?"
          select
          {...register('ownerType')}
          defaultValue={OwnerType.HOUSEHOLD}
        >
          <MenuItem value={OwnerType.HOUSEHOLD}>Del hogar</MenuItem>
          <MenuItem value={OwnerType.MEMBER}>De un integrante</MenuItem>
        </TextField>
        {selectedOwnerType === OwnerType.MEMBER && (
          <TextField
            label="Integrante"
            select
            {...register('ownerId')}
            error={Boolean(errors.ownerId)}
            helperText={errors.ownerId?.message}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label="Saldo actual"
          type="number"
          {...register('balance')}
          error={Boolean(errors.balance)}
          helperText={errors.balance?.message}
        />
        <TextField
          label="Frase de contexto (opcional)"
          placeholder="Ej: Acá entra la jubilación todos los días 11"
          {...register('contextPhrase')}
        />
        {selectedType === AccountType.CREDIT_CARD && (
          <>
            <TextField
              label="Día de cierre"
              type="number"
              {...register('closingDay')}
              error={Boolean(errors.closingDay)}
              helperText={errors.closingDay?.message}
            />
            <TextField
              label="Día de vencimiento"
              type="number"
              {...register('dueDay')}
              error={Boolean(errors.dueDay)}
              helperText={errors.dueDay?.message}
            />
            <TextField
              label="Cuotas pendientes"
              type="number"
              {...register('installmentsRemaining')}
              error={Boolean(errors.installmentsRemaining)}
              helperText={errors.installmentsRemaining?.message}
            />
          </>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Agregar la cuenta'}
        </Button>
      </Stack>
    </Box>
  )
}

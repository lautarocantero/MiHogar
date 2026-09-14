import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPaymentFormSchema } from '@/validation/addPaymentFormSchema'
import { OwnerType, PaymentFrequency } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { resolveFrequencyLabel } from '@/utils/domain/resolveFrequencyLabel'
import type { AddPaymentFormProps } from '../typings/props'
import type { AddPaymentFormValues } from '../typings/types'

export function AddPaymentForm({
  onSubmit,
  isSubmitting,
  errorMessage
}: AddPaymentFormProps): React.JSX.Element {
  const members = useAppSelector(selectAllMembers)
  const accounts = useAppSelector(selectAllAccounts)
  const categories = useAppSelector(selectAllCategories)

  const {
    register,
    handleSubmit,
    watch,
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
      amount: 0
    }
  })

  const selectedOwnerType = watch('ownerType')
  const isRecurring = watch('recurring')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <TextField
          label="Concepto"
          placeholder="Ej: Luz — Edesur"
          {...register('concept')}
          error={Boolean(errors.concept)}
          helperText={errors.concept?.message}
        />
        <TextField
          label="Entidad"
          placeholder="Ej: Edesur S.A."
          {...register('entity')}
          error={Boolean(errors.entity)}
          helperText={errors.entity?.message}
        />
        <TextField
          label="¿Con qué cuenta se paga?"
          select
          {...register('accountId')}
          error={Boolean(errors.accountId)}
          helperText={errors.accountId?.message}
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Categoría"
          select
          {...register('categoryId')}
          error={Boolean(errors.categoryId)}
          helperText={errors.categoryId?.message}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
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
        <FormControlLabel
          control={<Switch defaultChecked {...register('recurring')} />}
          label="Se repite todos los meses"
        />
        {isRecurring && (
          <TextField label="Frecuencia" select {...register('frequency')}>
            {Object.values(PaymentFrequency).map((frequency) => (
              <MenuItem key={frequency} value={frequency}>
                {resolveFrequencyLabel(frequency)}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label="Próximo vencimiento"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('dueDate')}
          error={Boolean(errors.dueDate)}
          helperText={errors.dueDate?.message}
        />
        <TextField
          label="Monto"
          type="number"
          {...register('amount')}
          error={Boolean(errors.amount)}
          helperText={errors.amount?.message}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Agregar el pago'}
        </Button>
      </Stack>
    </Box>
  )
}

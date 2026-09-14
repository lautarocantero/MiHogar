import { Alert, Box, Button, InputAdornment, MenuItem, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quickAddFormSchema } from '@/validation/quickAddFormSchema'
import { MovementType } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { organicColors } from '@/theme/tokens'
import type { StepAmountAndDetailsProps } from '../typings/props'
import type { QuickAddFormValues } from '../typings/types'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

export function StepAmountAndDetails({
  type,
  onSubmit,
  onBack,
  isSubmitting,
  errorMessage
}: StepAmountAndDetailsProps): React.JSX.Element {
  const accounts = useAppSelector(selectAllAccounts)
  const categories = useAppSelector(selectAllCategories)
  const members = useAppSelector(selectAllMembers)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<QuickAddFormValues>({
    resolver: zodResolver(quickAddFormSchema),
    defaultValues: {
      type,
      amount: 0,
      date: TODAY_ISO,
      categoryId: '',
      accountId: '',
      toAccountId: ''
    }
  })

  const isTransfer = type === MovementType.TRANSFER

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <TextField
          label="¿Cuánto fue?"
          type="number"
          autoFocus
          {...register('amount')}
          error={Boolean(errors.amount)}
          helperText={errors.amount?.message}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
            htmlInput: { style: { fontSize: '1.75rem' } }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              '& fieldset': { borderColor: organicColors.orange.main, borderWidth: 3 }
            }
          }}
        />

        {!isTransfer && (
          <TextField
            label="¿De qué fue?"
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
        )}

        <TextField
          label={isTransfer ? '¿De qué cuenta sale?' : '¿Con qué cuenta?'}
          select
          {...register('accountId')}
          error={Boolean(errors.accountId)}
          helperText={errors.accountId?.message}
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name} · {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
            </MenuItem>
          ))}
        </TextField>

        {isTransfer && (
          <TextField
            label="¿A qué cuenta entra?"
            select
            {...register('toAccountId')}
            error={Boolean(errors.toAccountId)}
            helperText={errors.toAccountId?.message}
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name} · {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          label="¿Qué día?"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('date')}
          error={Boolean(errors.date)}
          helperText={errors.date?.message}
        />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" size="large" onClick={onBack} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Guardar el movimiento'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

import { InputAdornment, MenuItem, TextField } from '@mui/material'
import { MovementType } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { organicColors } from '@/theme/tokens'
import type { MovementFormFieldsProps } from '../typings/props'

export function MovementFormFields({
  register,
  errors,
  type
}: MovementFormFieldsProps): React.JSX.Element {
  const accounts = useAppSelector(selectAllAccounts)
  const categories = useAppSelector(selectAllCategories)
  const members = useAppSelector(selectAllMembers)
  const isTransfer = type === MovementType.TRANSFER

  return (
    <>
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
    </>
  )
}

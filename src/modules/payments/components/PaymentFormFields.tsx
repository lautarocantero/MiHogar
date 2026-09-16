import { Controller } from 'react-hook-form'
import { FormControlLabel, MenuItem, Switch, TextField } from '@mui/material'
import { OwnerType, PaymentFrequency } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { resolveFrequencyLabel } from '@/utils/domain/resolveFrequencyLabel'
import { MemberOwnerField } from '@/components/shared/MemberOwnerField'
import type { PaymentFormFieldsProps } from '../typings/props'

export function PaymentFormFields({
  register,
  control,
  errors,
  selectedOwnerType,
  isRecurring
}: PaymentFormFieldsProps): React.JSX.Element {
  const accounts = useAppSelector(selectAllAccounts)
  const categories = useAppSelector(selectAllCategories)

  return (
    <>
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
        defaultValue={selectedOwnerType}
      >
        <MenuItem value={OwnerType.HOUSEHOLD}>Del hogar</MenuItem>
        <MenuItem value={OwnerType.MEMBER}>De un integrante</MenuItem>
      </TextField>
      {selectedOwnerType === OwnerType.MEMBER && (
        <Controller
          name="ownerId"
          control={control}
          render={({ field }) => (
            <MemberOwnerField
              value={field.value ?? ''}
              onChange={field.onChange}
              error={Boolean(errors.ownerId)}
              helperText={errors.ownerId?.message}
            />
          )}
        />
      )}
      <FormControlLabel
        control={<Switch defaultChecked={isRecurring} {...register('recurring')} />}
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
    </>
  )
}

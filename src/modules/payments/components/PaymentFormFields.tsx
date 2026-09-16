import { Controller } from 'react-hook-form'
import { FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'
import {
  AmountMode,
  CategoryKind,
  OwnerType,
  PaymentFrequency,
  PaymentKind
} from '@/typings/domain/enums'
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
  isRecurring,
  kind,
  selectedAmountMode
}: PaymentFormFieldsProps): React.JSX.Element {
  const accounts = useAppSelector(selectAllAccounts)
  const allCategories = useAppSelector(selectAllCategories)
  const isDeposit = kind === PaymentKind.DEPOSIT
  const categories = allCategories.filter(
    (category) => category.kind === (isDeposit ? CategoryKind.INCOME : CategoryKind.EXPENSE)
  )

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
      <Controller
        name="accountId"
        control={control}
        render={({ field }) => (
          <TextField
            label={isDeposit ? '¿A qué cuenta entra?' : '¿Con qué cuenta se paga?'}
            select
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={Boolean(errors.accountId)}
            helperText={errors.accountId?.message}
          >
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <TextField
            label="Categoría"
            select
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
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
      />
      <Controller
        name="ownerType"
        control={control}
        render={({ field }) => (
          <TextField label="¿De quién es?" select value={field.value} onChange={field.onChange}>
            <MenuItem value={OwnerType.HOUSEHOLD}>Del hogar</MenuItem>
            <MenuItem value={OwnerType.MEMBER}>De un integrante</MenuItem>
          </TextField>
        )}
      />
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
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <TextField
              label="Frecuencia"
              select
              value={field.value ?? ''}
              onChange={field.onChange}
            >
              {Object.values(PaymentFrequency).map((frequency) => (
                <MenuItem key={frequency} value={frequency}>
                  {resolveFrequencyLabel(frequency)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      )}
      <TextField
        label={isDeposit ? 'Próximo ingreso' : 'Próximo vencimiento'}
        type="date"
        slotProps={{ inputLabel: { shrink: true } }}
        {...register('dueDate')}
        error={Boolean(errors.dueDate)}
        helperText={errors.dueDate?.message}
      />
      {isDeposit && (
        <Controller
          name="amountMode"
          control={control}
          render={({ field }) => (
            <TextField label="El monto es" select value={field.value} onChange={field.onChange}>
              <MenuItem value={AmountMode.FIXED}>Fijo, siempre el mismo</MenuItem>
              <MenuItem value={AmountMode.VARIABLE}>Variable, cambia cada vez</MenuItem>
            </TextField>
          )}
        />
      )}
      {isDeposit && selectedAmountMode === AmountMode.VARIABLE ? (
        <Typography variant="body2" color="text.secondary">
          Vas a cargar el monto cuando llegue el depósito.
        </Typography>
      ) : (
        <TextField
          label="Monto"
          type="number"
          {...register('amount')}
          error={Boolean(errors.amount)}
          helperText={errors.amount?.message}
        />
      )}
    </>
  )
}

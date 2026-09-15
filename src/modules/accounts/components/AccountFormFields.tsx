import { MenuItem, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import { AccountType, OwnerType } from '@/typings/domain/enums'
import { resolveAccountTypeLabel } from '@/utils/domain/resolveAccountTypeLabel'
import { MemberOwnerField } from '@/components/shared/MemberOwnerField'
import type { AccountFormFieldsProps } from '../typings/props'

const ACCOUNT_TYPES = [AccountType.BANK, AccountType.CASH, AccountType.CREDIT_CARD]

export function AccountFormFields({
  register,
  control,
  errors,
  selectedType,
  selectedOwnerType
}: AccountFormFieldsProps): React.JSX.Element {
  return (
    <>
      <TextField
        label="Nombre de la cuenta"
        {...register('name')}
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
      />
      <TextField label="Tipo de cuenta" select {...register('type')} defaultValue={selectedType}>
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
    </>
  )
}

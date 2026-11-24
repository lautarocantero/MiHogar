import { Controller, useWatch } from 'react-hook-form'
import { FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  AccountType,
  AmountMode,
  CategoryKind,
  OwnerType,
  PaymentFrequency,
  PaymentKind
} from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { resolveFrequencyLabel } from '@/utils/domain/resolveFrequencyLabel'
import { computeNextClosingDate } from '@/utils/domain/computeNextClosingDate'
import { MemberOwnerField } from '@/components/shared/MemberOwnerField'
import { CategoryField } from '@/components/shared/CategoryField'
import { NumberField } from '@/components/shared/NumberField'
import { FormSectionHeader } from '@/components/shared/FormSectionHeader'
import { parseAmountInput } from '@/utils/formatting/parseAmountInput'
import type { PaymentFormFieldsProps } from '../typings/props'
import { useT } from '@/i18n'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

export function PaymentFormFields({
  register,
  control,
  setValue,
  errors,
  selectedOwnerType,
  isRecurring,
  kind,
  selectedAmountMode,
  hasInstallments,
  onToggleInstallments
}: PaymentFormFieldsProps): React.JSX.Element {
  const t = useT()
  const accounts = useAppSelector(selectAllAccounts)
  const isDeposit = kind === PaymentKind.DEPOSIT
  const categoryKind = isDeposit ? CategoryKind.INCOME : CategoryKind.EXPENSE
  const selectedAccountId = useWatch({ control, name: 'accountId' })
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)
  const isCardPayment = selectedAccount?.type === AccountType.CREDIT_CARD
  const nextClosingDate =
    isCardPayment && selectedAccount?.closingDay
      ? computeNextClosingDate(selectedAccount.closingDay, new Date())
      : null
  const installmentsTotal = useWatch({ control, name: 'installmentsTotal' })
  const installmentsPaid = useWatch({ control, name: 'installmentsPaid' })
  const installmentsRemaining =
    typeof installmentsTotal === 'number'
      ? Math.max(installmentsTotal - (installmentsPaid ?? 0), 0)
      : null

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <FormSectionHeader
              step={1}
              title={t('payments.form.basicInfo')}
              subtitle={t('payments.form.basicInfoSubtitle')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label={t('payments.form.concept')}
              placeholder={t('payments.form.conceptPlaceholder')}
              {...register('concept')}
              error={Boolean(errors.concept)}
              helperText={errors.concept?.message && t(errors.concept.message)}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label={t('payments.form.entity')}
              placeholder={t('payments.form.entityPlaceholder')}
              {...register('entity')}
              error={Boolean(errors.entity)}
              helperText={errors.entity?.message && t(errors.entity.message)}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="accountId"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label={isDeposit ? t('payments.form.depositAccount') : t('payments.form.paymentAccount')}
                  select
                  value={field.value ?? ''}
                  onChange={(event) => {
                    field.onChange(event)
                    const nextAccount = accounts.find(
                      (account) => account.id === event.target.value
                    )
                    if (nextAccount?.type === AccountType.CREDIT_CARD) {
                      setValue('dueDate', TODAY_ISO)
                    }
                  }}
                  onBlur={field.onBlur}
                  error={Boolean(errors.accountId)}
                  helperText={errors.accountId?.message && t(errors.accountId.message)}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <CategoryField
                  kind={categoryKind}
                  label={t('payments.form.category')}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={Boolean(errors.categoryId)}
                  helperText={errors.categoryId?.message && t(errors.categoryId.message)}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: selectedOwnerType === OwnerType.MEMBER ? 6 : 12 }}>
            <Controller
              name="ownerType"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label={t('payments.form.owner')}
                  select
                  value={field.value}
                  onChange={field.onChange}
                >
                  <MenuItem value={OwnerType.HOUSEHOLD}>Del hogar</MenuItem>
                  <MenuItem value={OwnerType.MEMBER}>De un integrante</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {selectedOwnerType === OwnerType.MEMBER && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="ownerId"
                control={control}
                render={({ field }) => (
                  <MemberOwnerField
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={Boolean(errors.ownerId)}
                    helperText={errors.ownerId?.message && t(errors.ownerId.message)}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <FormSectionHeader
              step={2}
              title={t('payments.form.details')}
              subtitle={t('payments.form.detailsSubtitle')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: isRecurring ? 6 : 12 }}>
            <FormControlLabel
              control={<Switch defaultChecked={isRecurring} {...register('recurring')} />}
              label={t('payments.form.recurring')}
            />
          </Grid>
          {isRecurring && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label={t('payments.form.frequency')}
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
            </Grid>
          )}
          <Grid size={12}>
            <TextField
              fullWidth
              label={
                isCardPayment
                  ? t('payments.form.addedDate')
                  : isDeposit
                    ? t('payments.form.nextIncome')
                    : t('payments.form.nextDueDate')
              }
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('dueDate')}
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate?.message && t(errors.dueDate.message)}
            />
          </Grid>
          {nextClosingDate && (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary">
                {t('payments.form.cardPaidOn', { date: nextClosingDate })}
              </Typography>
            </Grid>
          )}
          {isDeposit && (
            <Grid size={12}>
              <Controller
                name="amountMode"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label={t('payments.form.amountMode')}
                    select
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <MenuItem value={AmountMode.FIXED}>{t('payments.form.amountFixed')}</MenuItem>
                    <MenuItem value={AmountMode.VARIABLE}>{t('payments.form.amountVariable')}</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          )}
          {isDeposit && selectedAmountMode === AmountMode.VARIABLE ? (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary">
                {t('payments.form.variableHint')}
              </Typography>
            </Grid>
          ) : (
            <Grid size={12}>
              <NumberField
                fullWidth
                label={t('payments.form.amount')}
                {...register('amount', { setValueAs: parseAmountInput })}
                error={Boolean(errors.amount)}
                helperText={errors.amount?.message && t(errors.amount.message)}
              />
            </Grid>
          )}
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={hasInstallments}
                  onChange={(event) => onToggleInstallments(event.target.checked)}
                />
              }
              label={t('payments.form.hasInstallments')}
            />
          </Grid>
          {hasInstallments && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <NumberField
                  fullWidth
                  label={t('payments.form.installmentsTotal')}
                  {...register('installmentsTotal', { setValueAs: parseAmountInput })}
                  error={Boolean(errors.installmentsTotal)}
                  helperText={errors.installmentsTotal?.message && t(errors.installmentsTotal.message)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <NumberField
                  fullWidth
                  label={t('payments.form.installmentsPaid')}
                  {...register('installmentsPaid', { setValueAs: parseAmountInput })}
                  error={Boolean(errors.installmentsPaid)}
                  helperText={errors.installmentsPaid?.message && t(errors.installmentsPaid.message)}
                />
              </Grid>
              {installmentsRemaining != null && (
                <Grid size={12}>
                  <Typography variant="body2" color="text.secondary">
                    {installmentsRemaining === 1
                      ? t('payments.form.oneInstallmentLeft')
                      : t('payments.form.installmentsLeft', { count: installmentsRemaining })}
                  </Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

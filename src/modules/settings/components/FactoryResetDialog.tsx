import { useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Stack
} from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { useFactoryReset } from '../useFactoryReset'
import { FactoryResetCategory } from '../typings/enums'
import type { FactoryResetDialogProps } from '../typings/props'
import { useT } from '@/i18n'

const CATEGORY_OPTIONS: Array<{ value: FactoryResetCategory; labelKey: string }> = [
  { value: FactoryResetCategory.ACCOUNTS, labelKey: 'settings.factoryReset.accounts' },
  { value: FactoryResetCategory.MOVEMENTS, labelKey: 'settings.factoryReset.movements' },
  { value: FactoryResetCategory.PAYMENTS, labelKey: 'settings.factoryReset.payments' },
  { value: FactoryResetCategory.SAVINGS, labelKey: 'settings.factoryReset.savings' },
  { value: FactoryResetCategory.MEMBERS, labelKey: 'settings.factoryReset.members' },
  { value: FactoryResetCategory.CATEGORIES, labelKey: 'settings.factoryReset.categories' },
  { value: FactoryResetCategory.HOUSEHOLD_NAME, labelKey: 'settings.factoryReset.householdName' }
]

const ALL_CATEGORIES = CATEGORY_OPTIONS.map((option) => option.value)

export function FactoryResetDialog({ open, onClose }: FactoryResetDialogProps): React.JSX.Element {
  const t = useT()
  const [selected, setSelected] = useState<FactoryResetCategory[]>([])
  const { submit, isSubmitting, errorMessage } = useFactoryReset(() => {
    setSelected([])
    onClose()
  })

  const toggle = (category: FactoryResetCategory): void => {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    )
  }

  const allSelected = selected.length === ALL_CATEGORIES.length

  const handleClose = (): void => {
    setSelected([])
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="factory-reset-title"
    >
      <DialogHeader id="factory-reset-title" onClose={handleClose}>
        {t('settings.factoryReset.title')}
      </DialogHeader>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="warning">{t('settings.factoryReset.warning')}</Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={selected.length > 0 && !allSelected}
                onChange={() => setSelected(allSelected ? [] : ALL_CATEGORIES)}
              />
            }
            label={t('settings.factoryReset.selectAll')}
          />
          <Divider />
          <Stack spacing={0.5}>
            {CATEGORY_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={selected.includes(option.value)}
                    onChange={() => toggle(option.value)}
                  />
                }
                label={t(option.labelKey)}
              />
            ))}
          </Stack>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={() => submit(selected)}
          color="error"
          variant="contained"
          disabled={isSubmitting || selected.length === 0}
        >
          {isSubmitting ? t('common.deleting') : t('settings.factoryReset.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

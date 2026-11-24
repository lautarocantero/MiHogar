import { useState } from 'react'
import { Alert, Button, Card, Stack, Typography } from '@mui/material'
import { FontSizeSwitcher } from './components/FontSizeSwitcher'
import { DateFormatSwitcher } from './components/DateFormatSwitcher'
import { HouseholdKeyForm } from './components/HouseholdKeyForm'
import { MembersList } from './components/MembersList'
import { ExportImportButtons } from './components/ExportImportButtons'
import { ReminderSettings } from './components/ReminderSettings'
import { FactoryResetDialog } from './components/FactoryResetDialog'
import { AccountSettingsCard } from './components/AccountSettingsCard'
import { useChangeHouseholdKey } from './useChangeHouseholdKey'
import { useAppSelector } from '@/store/hooks'
import { selectIsDemoMode } from '@/store/vault/vaultSelectors'
import { useT } from '@/i18n'
import { LanguageSwitcher } from './components/LanguageSwitcher'

export function SettingsPage(): React.JSX.Element {
  const t = useT()
  const { submit, isSubmitting, errorMessage, successMessage } = useChangeHouseholdKey()
  const [isFactoryResetOpen, setIsFactoryResetOpen] = useState(false)
  const isDemoMode = useAppSelector(selectIsDemoMode)

  return (
    <Stack spacing={{ xs: 3, sm: 4 }} component="section" aria-label={t('settings.pageLabel')} maxWidth={640}>
      <LanguageSwitcher />

      <FontSizeSwitcher />

      <DateFormatSwitcher />

      <ReminderSettings />

      <MembersList />

      {isDemoMode ? (
        <Alert severity="info">{t('settings.demoNotice')}</Alert>
      ) : (
        <>
          <AccountSettingsCard />

          <Card sx={{ p: { xs: 2, sm: 3 } }} elevation={0}>
            <HouseholdKeyForm
              onSubmit={submit}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              successMessage={successMessage}
            />
          </Card>

          <ExportImportButtons />

          <Card sx={{ p: { xs: 2, sm: 3 } }} elevation={0}>
            <Stack spacing={2}>
              <Typography variant="h6" component="h2">
                {t('settings.danger.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('settings.danger.description')}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setIsFactoryResetOpen(true)}
                sx={{ alignSelf: 'flex-start' }}
              >
                {t('settings.factoryReset.title')}
              </Button>
            </Stack>
          </Card>

          <FactoryResetDialog
            open={isFactoryResetOpen}
            onClose={() => setIsFactoryResetOpen(false)}
          />
        </>
      )}
    </Stack>
  )
}

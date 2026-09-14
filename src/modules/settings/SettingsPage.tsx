import { Card, Stack } from '@mui/material'
import { FontSizeSwitcher } from './components/FontSizeSwitcher'
import { HouseholdKeyForm } from './components/HouseholdKeyForm'
import { MembersList } from './components/MembersList'
import { ExportImportButtons } from './components/ExportImportButtons'
import { ReminderSettings } from './components/ReminderSettings'
import { useChangeHouseholdKey } from './useChangeHouseholdKey'

export function SettingsPage(): React.JSX.Element {
  const { submit, isSubmitting, errorMessage, successMessage } = useChangeHouseholdKey()

  return (
    <Stack spacing={4} component="section" aria-label="Ajustes y letra" maxWidth={640}>
      <FontSizeSwitcher />

      <ReminderSettings />

      <Card sx={{ p: 3 }} elevation={0}>
        <HouseholdKeyForm
          onSubmit={submit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </Card>

      <MembersList />

      <ExportImportButtons />
    </Stack>
  )
}

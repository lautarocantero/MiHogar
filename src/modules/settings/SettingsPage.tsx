import { useState } from 'react'
import { Alert, Button, Card, Stack, Typography } from '@mui/material'
import { FontSizeSwitcher } from './components/FontSizeSwitcher'
import { HouseholdKeyForm } from './components/HouseholdKeyForm'
import { MembersList } from './components/MembersList'
import { ExportImportButtons } from './components/ExportImportButtons'
import { ReminderSettings } from './components/ReminderSettings'
import { FactoryResetDialog } from './components/FactoryResetDialog'
import { useChangeHouseholdKey } from './useChangeHouseholdKey'
import { useAppSelector } from '@/store/hooks'
import { selectIsDemoMode } from '@/store/vault/vaultSelectors'

export function SettingsPage(): React.JSX.Element {
  const { submit, isSubmitting, errorMessage, successMessage } = useChangeHouseholdKey()
  const [isFactoryResetOpen, setIsFactoryResetOpen] = useState(false)
  const isDemoMode = useAppSelector(selectIsDemoMode)

  return (
    <Stack spacing={4} component="section" aria-label="Configuración" maxWidth={640}>
      <FontSizeSwitcher />

      <ReminderSettings />

      <MembersList />

      {isDemoMode ? (
        <Alert severity="info">
          La clave del hogar, el respaldo y el reinicio de fábrica no están disponibles en el modo
          demo.
        </Alert>
      ) : (
        <>
          <Card sx={{ p: 3 }} elevation={0}>
            <HouseholdKeyForm
              onSubmit={submit}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              successMessage={successMessage}
            />
          </Card>

          <ExportImportButtons />

          <Card sx={{ p: 3 }} elevation={0}>
            <Stack spacing={2}>
              <Typography variant="h6" component="h2">
                Zona de riesgo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Borrá tus datos y volvé a empezar de cero. Te va a preguntar qué querés eliminar.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setIsFactoryResetOpen(true)}
                sx={{ alignSelf: 'flex-start' }}
              >
                Volver a estado de fábrica
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

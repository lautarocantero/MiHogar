import { Alert, Card, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { useReminderPreference } from '../useReminderPreference'

export function ReminderSettings(): React.JSX.Element {
  const { isEnabled, setEnabled, errorMessage } = useReminderPreference()

  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Recordatorios de pago
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Te avisamos con una notificación cuando un pago vence hoy o mañana.
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={(event) => setEnabled(event.target.checked)}
              inputProps={{ 'aria-label': 'Activar recordatorios de pago' }}
            />
          }
          label={isEnabled ? 'Activados' : 'Desactivados'}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>
    </Card>
  )
}

import {
  Alert,
  Card,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useReminderPreference } from '../useReminderPreference'

const LEAD_DAYS_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'El mismo día' },
  { value: 1, label: '1 día antes' },
  { value: 3, label: '3 días antes' },
  { value: 7, label: '1 semana antes' }
]

export function ReminderSettings(): React.JSX.Element {
  const { isEnabled, setEnabled, leadDays, setLeadDays, errorMessage } = useReminderPreference()

  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Recordatorios de pago
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Te avisamos con una notificación con la anticipación que elijas.
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
        {isEnabled && (
          <TextField
            label="Avisar con"
            select
            value={leadDays}
            onChange={(event) => setLeadDays(Number(event.target.value))}
            sx={{ maxWidth: 260 }}
          >
            {LEAD_DAYS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>
    </Card>
  )
}

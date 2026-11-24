import {
  Alert,
  Button,
  Card,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useT } from '@/i18n'
import { useReminderPreference } from '../useReminderPreference'

const LEAD_DAYS_OPTIONS: Array<{ value: number; labelKey: string }> = [
  { value: 0, labelKey: 'reminders.leadDays.sameDay' },
  { value: 1, labelKey: 'reminders.leadDays.oneDay' },
  { value: 3, labelKey: 'reminders.leadDays.threeDays' },
  { value: 7, labelKey: 'reminders.leadDays.oneWeek' }
]

export function ReminderSettings(): React.JSX.Element {
  const t = useT()
  const {
    isEnabled,
    setEnabled,
    leadDays,
    setLeadDays,
    permission,
    requestPermission,
    errorMessage
  } = useReminderPreference()

  return (
    <Card
      sx={{ p: { xs: 2, sm: 3 } }}
      elevation={0}
      component="section"
      aria-labelledby="reminders-title"
    >
      <Stack spacing={2}>
        <Typography id="reminders-title" variant="h6" component="h2">
          {t('reminders.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('reminders.description')}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={(event) => setEnabled(event.target.checked)}
              inputProps={{ 'aria-label': t('reminders.toggleLabel') }}
            />
          }
          label={isEnabled ? t('reminders.enabled') : t('reminders.disabled')}
        />
        {isEnabled && (
          <TextField
            label={t('reminders.leadDaysLabel')}
            select
            value={leadDays}
            onChange={(event) => setLeadDays(Number(event.target.value))}
            sx={{ maxWidth: { sm: 260 } }}
            fullWidth
          >
            {LEAD_DAYS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </MenuItem>
            ))}
          </TextField>
        )}
        {isEnabled && permission === 'default' && (
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={requestPermission}>
                {t('reminders.permission.allow')}
              </Button>
            }
          >
            {t('reminders.permission.needed')}
          </Alert>
        )}
        {isEnabled && permission === 'denied' && (
          <Alert severity="warning">{t('reminders.permission.denied')}</Alert>
        )}
        {isEnabled && permission === 'unsupported' && (
          <Alert severity="info">{t('reminders.permission.unsupported')}</Alert>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>
    </Card>
  )
}

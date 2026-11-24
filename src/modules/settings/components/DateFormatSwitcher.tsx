import { Button, Card, Stack, Typography } from '@mui/material'
import { useDateFormat } from '@/theme/DateFormat/useDateFormat'
import { DateFormat } from '@/theme/DateFormat/typings/enums'
import { useT } from '@/i18n'

const OPTIONS: Array<{ format: DateFormat; labelKey: string }> = [
  { format: DateFormat.DMY, labelKey: 'settings.dateFormat.dmy' },
  { format: DateFormat.MDY, labelKey: 'settings.dateFormat.mdy' }
]

export function DateFormatSwitcher(): React.JSX.Element {
  const t = useT()
  const { format, setFormat } = useDateFormat()

  return (
    <Card sx={{ p: { xs: 2, sm: 3 } }} elevation={0}>
      <Stack spacing={2}>
        <Typography id="date-format-title" variant="h6" component="h2">
          {t('settings.dateFormat.title')}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          role="group"
          aria-labelledby="date-format-title"
        >
          {OPTIONS.map((option) => (
            <Button
              key={option.format}
              variant={format === option.format ? 'contained' : 'outlined'}
              onClick={() => setFormat(option.format)}
              aria-pressed={format === option.format}
              size="large"
            >
              {t(option.labelKey)}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

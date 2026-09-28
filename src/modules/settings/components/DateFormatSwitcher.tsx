import { Button, Card, Stack, Typography } from '@mui/material'
import { useDateFormat } from '@/theme/DateFormat/useDateFormat'
import { DateFormat } from '@/theme/DateFormat/typings/enums'

const OPTIONS: Array<{ format: DateFormat; label: string }> = [
  { format: DateFormat.DMY, label: 'Día/Mes/Año (31/12/2026)' },
  { format: DateFormat.MDY, label: 'Mes/Día/Año (12/31/2026)' }
]

export function DateFormatSwitcher(): React.JSX.Element {
  const { format, setFormat } = useDateFormat()

  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Formato de fecha
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          role="radiogroup"
          aria-label="Formato de fecha"
        >
          {OPTIONS.map((option) => (
            <Button
              key={option.format}
              variant={format === option.format ? 'contained' : 'outlined'}
              onClick={() => setFormat(option.format)}
              aria-pressed={format === option.format}
              size="large"
            >
              {option.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

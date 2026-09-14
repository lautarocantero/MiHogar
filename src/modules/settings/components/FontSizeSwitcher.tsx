import { Button, Card, Stack, Typography } from '@mui/material'
import { useFontScale } from '@/theme/FontScale/useFontScale'
import { FontSizeLevel } from '@/theme/FontScale/typings/enums'

const OPTIONS: Array<{ level: FontSizeLevel; label: string }> = [
  { level: FontSizeLevel.NORMAL, label: 'Normal' },
  { level: FontSizeLevel.LARGE, label: 'Grande (+15%)' },
  { level: FontSizeLevel.XLARGE, label: 'Muy grande (+30%)' }
]

export function FontSizeSwitcher(): React.JSX.Element {
  const { level, setLevel } = useFontScale()

  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Tamaño de la letra
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          role="radiogroup"
          aria-label="Tamaño de la letra"
        >
          {OPTIONS.map((option) => (
            <Button
              key={option.level}
              variant={level === option.level ? 'contained' : 'outlined'}
              onClick={() => setLevel(option.level)}
              aria-pressed={level === option.level}
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

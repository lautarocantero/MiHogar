import { Button, Card, Stack, Typography } from '@mui/material'
import { useFontScale } from '@/theme/FontScale/useFontScale'
import { FontSizeLevel } from '@/theme/FontScale/typings/enums'
import { useT } from '@/i18n'

const OPTIONS: Array<{ level: FontSizeLevel; labelKey: string }> = [
  { level: FontSizeLevel.XSMALL, labelKey: 'settings.fontSize.xsmall' },
  { level: FontSizeLevel.SMALL, labelKey: 'settings.fontSize.small' },
  { level: FontSizeLevel.NORMAL, labelKey: 'settings.fontSize.normal' },
  { level: FontSizeLevel.LARGE, labelKey: 'settings.fontSize.large' },
  { level: FontSizeLevel.XLARGE, labelKey: 'settings.fontSize.xlarge' }
]

export function FontSizeSwitcher(): React.JSX.Element {
  const t = useT()
  const { level, setLevel } = useFontScale()

  return (
    <Card sx={{ p: { xs: 2, sm: 3 } }} elevation={0}>
      <Stack spacing={2}>
        <Typography id="font-size-title" variant="h6" component="h2">
          {t('settings.fontSize.title')}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          role="group"
          aria-labelledby="font-size-title"
        >
          {OPTIONS.map((option) => (
            <Button
              key={option.level}
              variant={level === option.level ? 'contained' : 'outlined'}
              onClick={() => setLevel(option.level)}
              aria-pressed={level === option.level}
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

import { Button, Card, Stack, Typography } from '@mui/material'
import { SUPPORTED_LOCALES, useI18n } from '@/i18n'

/** Selector de idioma de Configuración: un botón por idioma, el activo queda presionado. */
export function LanguageSwitcher(): React.JSX.Element {
  const { locale, setLocale, t } = useI18n()

  return (
    <Card
      sx={{ p: { xs: 2, sm: 3 } }}
      elevation={0}
      component="section"
      aria-labelledby="language-title"
    >
      <Stack spacing={2}>
        <Typography id="language-title" variant="h6" component="h2">
          {t('settings.language.title')}
        </Typography>
        <Typography id="language-description" variant="body2" color="text.secondary">
          {t('settings.language.description')}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          role="group"
          aria-labelledby="language-title"
          aria-describedby="language-description"
        >
          {SUPPORTED_LOCALES.map((option) => (
            <Button
              key={option}
              lang={option}
              variant={locale === option ? 'contained' : 'outlined'}
              onClick={() => setLocale(option)}
              aria-pressed={locale === option}
              size="large"
            >
              {t(`common.language.${option}`)}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

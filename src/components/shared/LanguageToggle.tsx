import { Button } from '@mui/material'
import TranslateIcon from '@mui/icons-material/Translate'
import { useI18n } from '@/i18n'
import type { Locale } from '@/i18n'

/** Cambia entre español e inglés. Muestra el idioma al que se va a cambiar. */
export function LanguageToggle(): React.JSX.Element {
  const { locale, setLocale, t } = useI18n()
  const nextLocale: Locale = locale === 'es' ? 'en' : 'es'
  const nextLabel = t(`common.language.${nextLocale}`)

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<TranslateIcon />}
      onClick={() => setLocale(nextLocale)}
      aria-label={t('onboarding.switchLanguage', { language: nextLabel })}
      sx={{ backgroundColor: 'background.paper' }}
    >
      <span lang={nextLocale}>{nextLabel}</span>
    </Button>
  )
}

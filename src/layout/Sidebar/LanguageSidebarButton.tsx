import TranslateIcon from '@mui/icons-material/Translate'
import { useI18n } from '@/i18n'
import type { Locale } from '@/i18n'
import { SidebarActionButton } from './SidebarActionButton'

type LanguageSidebarButtonProps = {
  collapsed?: boolean
}

/** Versión compacta del selector de idioma para el pie del sidebar: muestra el idioma destino. */
export function LanguageSidebarButton({
  collapsed = false
}: LanguageSidebarButtonProps): React.JSX.Element {
  const { locale, setLocale, t } = useI18n()
  const nextLocale: Locale = locale === 'es' ? 'en' : 'es'
  const nextLabel = t(`common.language.${nextLocale}`)

  return (
    <SidebarActionButton
      collapsed={collapsed}
      action={{
        label: nextLabel,
        ariaLabel: t('onboarding.switchLanguage', { language: nextLabel }),
        lang: nextLocale,
        icon: TranslateIcon,
        onClick: () => setLocale(nextLocale)
      }}
    />
  )
}

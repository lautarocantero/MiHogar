import { useMediaQuery, useTheme } from '@mui/material'

export type ResponsiveInfo = {
  /** Teléfono: por debajo de `sm` (< 600px). */
  isPhone: boolean
  /** Escritorio: desde `md` (≥ 900px); por debajo, la navegación pasa a un drawer. */
  isDesktop: boolean
}

/**
 * Breakpoints compartidos de la app. Usar este hook en vez de llamar a `useMediaQuery`
 * por pantalla, así todos los componentes cambian de layout en el mismo punto.
 */
export function useResponsive(): ResponsiveInfo {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })
  return { isPhone, isDesktop }
}

/**
 * Los diálogos con formularios ocupan toda la pantalla en teléfonos (más espacio para
 * los campos y el teclado). Se pasa como `fullScreen` al `Dialog`.
 */
export function useFullScreenDialog(): boolean {
  return useResponsive().isPhone
}

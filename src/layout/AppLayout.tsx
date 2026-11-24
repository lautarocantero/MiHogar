import { Suspense, lazy, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'
import { AppHeader } from './Header/AppHeader'
import { usePaymentReminderScheduler } from '@/hooks/shared/usePaymentReminderScheduler'
import { useResponsive } from '@/hooks/shared/useResponsive'
import { ToastHost } from '@/components/shared/ToastHost'
import { SyncConflictDialog } from '@/components/shared/SyncConflictDialog'
import { UnsavedChangesDialog } from '@/components/shared/UnsavedChangesDialog'
import { useAppSelector } from '@/store/hooks'
import { selectIsDemoMode } from '@/store/vault/vaultSelectors'
import { PageSkeleton } from '@/router/PageSkeleton'
import { organicColors, organicLayout } from '@/theme/tokens'

const QuickAddModal = lazy(() =>
  import('@/modules/quickAdd/QuickAddModal').then((module) => ({ default: module.QuickAddModal }))
)

const NAVIGATION_ID = 'app-navigation'

/** Los recordatorios solo corren con datos reales: en la demo no se notifica nada. */
function PaymentReminderScheduler(): null {
  usePaymentReminderScheduler()
  return null
}

const withSafeArea = (base: number, inset: string): string => `calc(${base}px + ${inset})`

const MAIN_PADDING = {
  pt: { xs: 2, sm: 3, md: 4 },
  pl: {
    xs: withSafeArea(16, organicLayout.safeArea.left),
    sm: withSafeArea(24, organicLayout.safeArea.left),
    md: 4
  },
  pr: {
    xs: withSafeArea(16, organicLayout.safeArea.right),
    sm: withSafeArea(24, organicLayout.safeArea.right),
    md: withSafeArea(32, organicLayout.safeArea.right)
  },
  pb: {
    xs: withSafeArea(16, organicLayout.safeArea.bottom),
    sm: withSafeArea(24, organicLayout.safeArea.bottom),
    md: withSafeArea(32, organicLayout.safeArea.bottom)
  }
} as const

export function AppLayout(): React.JSX.Element {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { isDesktop } = useResponsive()
  const { pathname } = useLocation()
  const isDemoMode = useAppSelector(selectIsDemoMode)

  // El drawer de mobile se cierra al navegar y al pasar a escritorio (si no, quedaría
  // abierto "por detrás" al volver a achicar la ventana).
  useEffect(() => {
    setIsNavOpen(false)
  }, [pathname, isDesktop])

  return (
    <Box
      display="flex"
      overflow="hidden"
      sx={{
        height: '100vh',
        // dvh descuenta la barra del navegador en mobile; 100vh queda de respaldo.
        '@supports (height: 100dvh)': { height: '100dvh' }
      }}
    >
      <Sidebar
        id={NAVIGATION_ID}
        isMobile={!isDesktop}
        mobileOpen={isNavOpen}
        onMobileClose={() => setIsNavOpen(false)}
      />
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        minWidth={0}
        height="100%"
        overflow="hidden"
      >
        <AppHeader
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          navigation={
            isDesktop
              ? undefined
              : {
                  controlsId: NAVIGATION_ID,
                  isOpen: isNavOpen,
                  onOpen: () => setIsNavOpen(true)
                }
          }
        />
        <Box
          component="main"
          flexGrow={1}
          minHeight={0}
          overflow="auto"
          sx={{
            backgroundColor: organicColors.surface,
            // Padding responsive (16 / 24 / 32px) + márgenes seguros de iOS. Debajo de `md`
            // el sidebar es un drawer, así que el borde izquierdo también lo toca el main.
            ...MAIN_PADDING
          }}
        >
          {/* Suspense propio: al cargar una pantalla lazy solo se reemplaza el contenido, no
              todo el layout (si no, el header y el drawer se desmontaban a mitad de la
              transición y el fondo del drawer quedaba trabado en mobile). */}
          <Suspense fallback={<PageSkeleton disablePadding />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
      {isQuickAddOpen && (
        <Suspense fallback={null}>
          <QuickAddModal open={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
        </Suspense>
      )}
      <ToastHost />
      {!isDemoMode && <PaymentReminderScheduler />}
      <SyncConflictDialog />
      <UnsavedChangesDialog />
    </Box>
  )
}

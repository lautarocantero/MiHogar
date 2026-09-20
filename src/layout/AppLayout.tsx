import { Suspense, lazy, useState } from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'
import { AppHeader } from './Header/AppHeader'
import { usePaymentReminderScheduler } from '@/hooks/shared/usePaymentReminderScheduler'
import { ToastHost } from '@/components/shared/ToastHost'
import { organicColors } from '@/theme/tokens'

const QuickAddModal = lazy(() =>
  import('@/modules/quickAdd/QuickAddModal').then((module) => ({ default: module.QuickAddModal }))
)

export function AppLayout(): React.JSX.Element {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  usePaymentReminderScheduler()

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      <Sidebar />
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        flexGrow={1}
        minWidth={0}
        height="100%"
        overflow="hidden"
      >
        <AppHeader onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
        <Box
          component="main"
          flexGrow={1}
          minHeight={0}
          overflow="auto"
          p={4}
          sx={{ backgroundColor: organicColors.surface }}
        >
          <Outlet />
        </Box>
      </Box>
      {isQuickAddOpen && (
        <Suspense fallback={null}>
          <QuickAddModal open={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
        </Suspense>
      )}
      <ToastHost />
    </Box>
  )
}

import { Snackbar } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectToast } from '@/store/ui/uiSelectors'
import { clearToast } from '@/store/ui/uiSlice'
import { organicColors } from '@/theme/tokens'

const AUTO_HIDE_MS = 3500

export function ToastHost(): React.JSX.Element {
  const toast = useAppSelector(selectToast)
  const dispatch = useAppDispatch()

  return (
    <Snackbar
      key={toast?.key}
      open={Boolean(toast)}
      autoHideDuration={AUTO_HIDE_MS}
      onClose={() => dispatch(clearToast())}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      message={toast?.message}
      slotProps={{
        content: {
          sx: {
            backgroundColor: organicColors.orange.main,
            color: '#ffffff',
            fontWeight: 600,
            justifyContent: 'center'
          }
        }
      }}
    />
  )
}

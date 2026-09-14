import { Alert, Snackbar } from '@mui/material'
import { useState } from 'react'
import { FontScaleContext } from './FontScaleContext'
import { useFontScalePersistence } from './useFontScalePersistence'
import type { FontScaleProviderProps } from './typings/props'

export function FontScaleProvider({ children }: FontScaleProviderProps): React.JSX.Element {
  const { level, setLevel, error } = useFontScalePersistence()
  const [dismissed, setDismissed] = useState(false)

  return (
    <FontScaleContext.Provider value={{ level, setLevel }}>
      {children}
      <Snackbar open={Boolean(error) && !dismissed} onClose={() => setDismissed(true)}>
        <Alert severity="warning" onClose={() => setDismissed(true)}>
          {error}
        </Alert>
      </Snackbar>
    </FontScaleContext.Provider>
  )
}

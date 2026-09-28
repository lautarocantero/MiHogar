import { Alert, Snackbar } from '@mui/material'
import { useState } from 'react'
import { DateFormatContext } from './DateFormatContext'
import { useDateFormatPersistence } from './useDateFormatPersistence'
import type { DateFormatProviderProps } from './typings/props'

export function DateFormatProvider({ children }: DateFormatProviderProps): React.JSX.Element {
  const { format, setFormat, error } = useDateFormatPersistence()
  const [dismissed, setDismissed] = useState(false)

  return (
    <DateFormatContext.Provider value={{ format, setFormat }}>
      {children}
      <Snackbar open={Boolean(error) && !dismissed} onClose={() => setDismissed(true)}>
        <Alert severity="warning" onClose={() => setDismissed(true)}>
          {error}
        </Alert>
      </Snackbar>
    </DateFormatContext.Provider>
  )
}

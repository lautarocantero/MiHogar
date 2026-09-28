import { useCallback, useEffect, useState } from 'react'
import { getPreferences, setPreferences } from '@/apis/preferencesApi'
import { useLoader } from '@/hooks/shared/useLoader'
import { DateFormat } from './typings/enums'
import type { DateFormatPersistenceResult } from './typings/types'

export function useDateFormatPersistence(): DateFormatPersistenceResult {
  const [format, setFormatState] = useState(DateFormat.DMY)
  const { error, run } = useLoader()

  useEffect(() => {
    run(getPreferences, 'No se pudo cargar el formato de fecha guardado').then((preferences) => {
      if (preferences) {
        setFormatState(preferences.dateFormat as DateFormat)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setFormat = useCallback(
    (nextFormat: DateFormat) => {
      setFormatState(nextFormat)
      run(async () => {
        const currentPreferences = await getPreferences()
        await setPreferences({ ...currentPreferences, dateFormat: nextFormat })
      }, 'No se pudo guardar el formato de fecha')
    },
    [run]
  )

  return { format, setFormat, error }
}

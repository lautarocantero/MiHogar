import { useCallback, useEffect, useState } from 'react'
import { getPreferences, setPreferences } from '@/apis/preferencesApi'
import { useLoader } from '@/hooks/shared/useLoader'
import { t } from '@/i18n'
import { FontSizeLevel } from './typings/enums'
import { organicFontScaleLevels } from '../tokens'
import type { FontScalePersistenceResult } from './typings/types'

const BASE_FONT_SIZE_PX = 16

export function useFontScalePersistence(): FontScalePersistenceResult {
  const [level, setLevelState] = useState(FontSizeLevel.NORMAL)
  const { error, run } = useLoader()

  useEffect(() => {
    run(getPreferences, t('settings.fontSize.loadFailed')).then((preferences) => {
      if (preferences) {
        setLevelState(preferences.fontSizeLevel as FontSizeLevel)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const multiplier = organicFontScaleLevels[level]
    document.documentElement.style.fontSize = `${BASE_FONT_SIZE_PX * multiplier}px`
  }, [level])

  const setLevel = useCallback(
    (nextLevel: FontSizeLevel) => {
      setLevelState(nextLevel)
      run(async () => {
        const currentPreferences = await getPreferences()
        await setPreferences({ ...currentPreferences, fontSizeLevel: nextLevel })
      }, t('settings.fontSize.saveFailed'))
    },
    [run]
  )

  return { level, setLevel, error }
}

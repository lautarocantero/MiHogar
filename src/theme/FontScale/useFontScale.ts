import { useContext } from 'react'
import { FontScaleContext } from './FontScaleContext'
import type { FontScaleContextValue } from './typings/types'

export function useFontScale(): FontScaleContextValue {
  return useContext(FontScaleContext)
}

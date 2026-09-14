import { createContext } from 'react'
import { FontSizeLevel } from './typings/enums'
import type { FontScaleContextValue } from './typings/types'

export const FontScaleContext = createContext<FontScaleContextValue>({
  level: FontSizeLevel.NORMAL,
  setLevel: () => {}
})

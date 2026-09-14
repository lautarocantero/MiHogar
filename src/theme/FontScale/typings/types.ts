import type { FontSizeLevel } from './enums'

export type FontScaleContextValue = {
  level: FontSizeLevel
  setLevel: (level: FontSizeLevel) => void
}

export type FontScalePersistenceResult = FontScaleContextValue & {
  error: string | null
}

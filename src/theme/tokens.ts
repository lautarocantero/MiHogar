import { FontSizeLevel } from './FontScale/typings/enums'

export const organicColors = {
  background: '#f5ead8',
  surface: '#fffdf9',
  orange: {
    // main oscurecido ~4% respecto al original (#b2622d) para que el texto blanco de los
    // botones contained cumpla 4.5:1 (WCAG AA) — el original daba 4.489:1
    main: '#ab5e2b',
    dark: '#8c491a',
    tint: '#fff2eb'
  },
  sage: {
    // main oscurecido ~7% respecto al original (#728157) por el mismo motivo — el original
    // daba 4.206:1 con texto blanco
    main: '#6a7851',
    dark: '#3d472b',
    tint: '#f0fae1'
  },
  brown: {
    main: '#7a4a23',
    dark: '#4f2f15',
    tint: '#f7ece1'
  },
  blue: {
    main: '#3f6a8a',
    dark: '#254a63',
    tint: '#e9f1f6'
  },
  neutral: {
    textSecondary: '#645c50',
    border: '#dcd3c4'
  }
} as const

export const organicTypography = {
  titleFontFamily: '"Caprasimo", "Figtree", sans-serif',
  bodyFontFamily: '"Figtree", sans-serif'
} as const

export const organicShape = {
  containerRadius: 28,
  pillRadius: 999,
  minTouchTargetHeight: 48
} as const

export const organicFontScaleLevels: Record<FontSizeLevel, number> = {
  [FontSizeLevel.XSMALL]: 0.8,
  [FontSizeLevel.SMALL]: 0.9,
  [FontSizeLevel.NORMAL]: 1,
  [FontSizeLevel.LARGE]: 1.15,
  [FontSizeLevel.XLARGE]: 1.3
}

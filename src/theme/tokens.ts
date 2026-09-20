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
  income: {
    main: '#2f4022',
    border: '#d7e7bf',
    iconBg: '#dcecc4',
    tint: '#eef6e2'
  },
  paid: {
    main: '#6b4b10',
    border: '#f0d492',
    tint: '#fbe7b4'
  },
  overdue: {
    main: '#993225',
    border: '#d9564a',
    tint: '#fde3e1'
  },
  neutral: {
    textSecondary: '#645c50',
    border: '#dcd3c4'
  },
  violet: {
    main: '#6a4a8a',
    dark: '#4a2f66',
    tint: '#f2e9f7',
    border: '#d9c4e8'
  },
  weakYellow: 'rgba(240, 212, 146, 0.85)',
  weakYellowMuted: 'rgba(240, 212, 146, 0.55)'
} as const

export const sidebarColors = {
  gradient: 'linear-gradient(180deg,#7a4a23 0%,#6b3f1d 45%,#583318 100%)',
  patternOpacity: 0.12,
  onDark: '#fffdf9'
} as const

export const headerColors = {
  gradient: 'linear-gradient(90deg,#f7e8d6 0%,#fbf3e8 42%,#fdf9f3 100%)',
  patternOpacity: 0.14
} as const

export const organicTypography = {
  titleFontFamily: '"Caprasimo", "Figtree", sans-serif',
  bodyFontFamily: '"Figtree", sans-serif'
} as const

export const organicShape = {
  containerRadius: 0,
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

import { createTheme } from '@mui/material/styles'
import { organicColors, organicShape, organicTypography } from './tokens'

export const organicTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: organicColors.background,
      paper: organicColors.surface
    },
    primary: {
      main: organicColors.orange.main,
      dark: organicColors.orange.dark,
      contrastText: '#ffffff'
    },
    secondary: {
      main: organicColors.sage.main,
      dark: organicColors.sage.dark,
      contrastText: '#ffffff'
    },
    text: {
      primary: organicColors.orange.dark,
      secondary: organicColors.neutral.textSecondary
    },
    divider: organicColors.neutral.border
  },
  shape: {
    borderRadius: organicShape.containerRadius
  },
  typography: {
    fontFamily: organicTypography.bodyFontFamily,
    htmlFontSize: 16,
    fontSize: 17,
    h1: { fontFamily: organicTypography.titleFontFamily },
    h2: { fontFamily: organicTypography.titleFontFamily },
    h3: { fontFamily: organicTypography.titleFontFamily },
    h4: { fontFamily: organicTypography.titleFontFamily },
    h5: { fontFamily: organicTypography.titleFontFamily },
    h6: { fontFamily: organicTypography.titleFontFamily },
    body1: { fontSize: '1.0625rem' },
    body2: { fontSize: '1rem' }
  },
  components: {
    // MuiButtonBase pone outline:0 en .Mui-focusVisible por defecto (espera que el
    // consumidor lo reemplace) — sin esto, todo Button/IconButton/ListItemButton (incluida
    // la navegación del Sidebar) queda sin anillo de foco visible al navegar con teclado.
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: `3px solid ${organicColors.orange.dark}`,
            outlineOffset: 2
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: organicShape.pillRadius,
          minHeight: organicShape.minTouchTargetHeight,
          textTransform: 'none',
          fontSize: '1.0625rem'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: organicShape.minTouchTargetHeight,
          minHeight: organicShape.minTouchTargetHeight
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: organicShape.pillRadius
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: organicShape.containerRadius
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: organicShape.containerRadius
        }
      }
    }
  }
})

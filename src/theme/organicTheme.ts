import { createTheme } from '@mui/material/styles'
import { organicColors, organicLayout, organicShape, organicTypography } from './tokens'

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
    // Área táctil mínima de 40px para los toggles (p. ej. tipo de gráfico en Informes).
    MuiToggleButton: {
      styleOverrides: {
        root: {
          minWidth: 40,
          minHeight: 40
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
    },
    // En teléfonos los diálogos que no son fullScreen (confirmaciones) usan márgenes de
    // 16px en vez de 32px, así no quedan angostos en 360px. Los de formulario se abren en
    // pantalla completa con `useFullScreenDialog` (src/hooks/shared/useResponsive.ts).
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            '&:not(.MuiDialog-paperFullScreen)': {
              margin: theme.spacing(2),
              maxWidth: `calc(100% - ${theme.spacing(4)})`,
              maxHeight: `calc(100% - ${theme.spacing(4)})`
            },
            '&.MuiDialog-paperFullWidth:not(.MuiDialog-paperFullScreen)': {
              width: `calc(100% - ${theme.spacing(4)})`
            },
            '&.MuiDialog-paperFullScreen': {
              paddingTop: organicLayout.safeArea.top,
              paddingBottom: organicLayout.safeArea.bottom
            }
          }
        })
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            fontSize: '1.125rem'
          }
        })
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
          }
        })
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            flexWrap: 'wrap',
            gap: theme.spacing(1),
            '& > :not(style) ~ :not(style)': { marginLeft: 0 }
          }
        })
      }
    },
    // Tablas: en pantallas chicas se reduce el padding de las celdas para que entren más
    // columnas antes de necesitar scroll horizontal (que lo da el TableContainer).
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1)
          }
        })
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }
      }
    }
  }
})

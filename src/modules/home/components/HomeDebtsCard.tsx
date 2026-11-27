import { useState } from 'react'
import { Box, Card, IconButton, Stack, Typography } from '@mui/material'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { HomeDebtsCardProps } from '../typings/props'

const HIDDEN_STORAGE_KEY = 'home-debts-hidden'

function readHidden(): boolean {
  try {
    return window.localStorage.getItem(HIDDEN_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeHidden(hidden: boolean): void {
  try {
    window.localStorage.setItem(HIDDEN_STORAGE_KEY, hidden ? '1' : '0')
  } catch {
    // per-viewer convenience only
  }
}

export function HomeDebtsCard({ debts, totalDebt }: HomeDebtsCardProps): React.JSX.Element | null {
  const [hidden, setHidden] = useState(readHidden)

  if (debts.length === 0) return null

  const toggle = (): void => {
    setHidden((current) => {
      writeHidden(!current)
      return !current
    })
  }

  return (
    <Card
      sx={{
        backgroundColor: organicColors.overdue.tint,
        border: `1px solid ${organicColors.overdue.border}`,
        px: 2.5,
        py: 1.5
      }}
      elevation={0}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <RequestQuoteIcon sx={{ color: organicColors.overdue.main }} aria-hidden="true" />
        <Typography
          component={RouterLink}
          to={ROUTES.DEBTS}
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.125rem',
            color: organicColors.overdue.main,
            textDecoration: 'none'
          }}
        >
          Deuda
        </Typography>
        <Typography
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.125rem',
            color: organicColors.overdue.main,
            flexGrow: 1
          }}
        >
          {hidden ? '$ ••••••' : formatCurrency(totalDebt)}
        </Typography>
        <IconButton
          size="small"
          onClick={toggle}
          aria-label={hidden ? 'Mostrar deudas' : 'Ocultar deudas'}
        >
          {hidden ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
        </IconButton>
      </Stack>
      {!hidden && (
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            m: 0,
            mt: 1,
            p: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {debts.map((debt) => (
            <Box
              component="li"
              key={debt.id}
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 1,
                px: 1.25,
                py: 0.5,
                backgroundColor: organicColors.surface,
                border: `1px solid ${organicColors.overdue.border}`
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {debt.counterparty} · {debt.name}
              </Typography>
              <Typography variant="body2" fontWeight={600} color={organicColors.overdue.main}>
                {formatCurrency(debt.amount)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  )
}

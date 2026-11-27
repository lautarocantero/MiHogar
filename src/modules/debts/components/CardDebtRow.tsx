import { useState } from 'react'
import { Box, Card, Collapse, IconButton, Stack, Typography } from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { format, parseISO } from 'date-fns'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { CardDebtRowProps } from '../typings/props'

export function CardDebtRow({ debt }: CardDebtRowProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      component="li"
      sx={{
        p: 2,
        backgroundColor: organicColors.surface,
        border: `1px solid ${organicColors.neutral.border}`
      }}
      elevation={0}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            flexShrink: 0,
            backgroundColor: organicColors.overdue.border,
            color: organicColors.overdue.main
          }}
        >
          <CreditCardIcon />
        </Box>
        <Box flexGrow={1} minWidth={0}>
          <Typography fontWeight={600} noWrap>
            {debt.bankName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {debt.account.name} · {debt.items.length}{' '}
            {debt.items.length === 1 ? 'consumo' : 'consumos'}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.25rem',
            color: organicColors.overdue.main
          }}
        >
          {formatCurrency(debt.totalRemaining)}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setExpanded((current) => !current)}
          aria-label={expanded ? 'Ocultar consumos' : 'Ver consumos'}
          aria-expanded={expanded}
          sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Stack>
      <Collapse in={expanded} unmountOnExit>
        <Stack component="ul" spacing={0.75} sx={{ listStyle: 'none', m: 0, mt: 1.5, p: 0, pl: 7 }}>
          {debt.items.map((item) => (
            <Stack
              key={item.movementId}
              component="li"
              direction="row"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography variant="body2" color="text.secondary" noWrap>
                {item.concept} · {format(parseISO(item.date), 'dd/MM/yy')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(item.remaining)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </Card>
  )
}

import { Box, Card, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import CallReceivedIcon from '@mui/icons-material/CallReceived'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { DebtsSummaryCardsProps } from '../typings/props'

export function DebtsSummaryCards({
  summary,
  activeCount
}: DebtsSummaryCardsProps): React.JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            backgroundColor: organicColors.overdue.tint,
            border: `1px solid ${organicColors.overdue.border}`
          }}
          elevation={0}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              flexShrink: 0,
              backgroundColor: organicColors.overdue.border,
              color: organicColors.overdue.main
            }}
          >
            <RequestQuoteIcon />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Debemos en total
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.75rem',
                color: organicColors.overdue.main
              }}
            >
              {formatCurrency(summary.totalOwedByHousehold)}
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            backgroundColor: organicColors.income.tint,
            border: `1px solid ${organicColors.income.border}`
          }}
          elevation={0}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              flexShrink: 0,
              backgroundColor: organicColors.income.iconBg,
              color: organicColors.income.main
            }}
          >
            <CallReceivedIcon />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Nos deben en total
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.75rem',
                color: organicColors.income.main
              }}
            >
              {formatCurrency(summary.totalOwedToHousehold)}
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            backgroundColor: organicColors.surface,
            border: `1px solid ${organicColors.neutral.border}`
          }}
          elevation={0}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              flexShrink: 0,
              backgroundColor: organicColors.orange.tint,
              color: organicColors.orange.dark
            }}
          >
            <ListAltIcon />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Deudas activas
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.75rem',
                color: organicColors.orange.dark
              }}
            >
              {activeCount}
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

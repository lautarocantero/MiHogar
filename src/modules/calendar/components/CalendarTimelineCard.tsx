import { Card, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatRelativeDaysLabel } from '@/utils/formatting/formatDate'
import { MovementType, PaymentKind } from '@/typings/domain/enums'
import type { CalendarTimelineCardProps } from '../typings/props'

function isIncomeEntry(entry: CalendarTimelineCardProps['entry']): boolean {
  return entry.origin === 'payment'
    ? entry.kind === PaymentKind.DEPOSIT
    : entry.movement.type === MovementType.INCOME
}

export function CalendarTimelineCard({
  entry,
  isHighlighted,
  onHover,
  onSelect
}: CalendarTimelineCardProps): React.JSX.Element {
  const isIncome = isIncomeEntry(entry)
  const relativeLabel = formatRelativeDaysLabel(entry.displayDate)
  const textColor = entry.isPast ? organicColors.weakYellow : '#1a1208'
  const mutedTextColor = entry.isPast ? organicColors.weakYellowMuted : 'rgba(26,18,8,0.7)'
  const amountColor = entry.isPast
    ? organicColors.weakYellow
    : isIncome
      ? organicColors.sage.tint
      : organicColors.orange.tint

  return (
    <Card
      component="button"
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(entry.displayDate)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(entry.displayDate)}
      onBlur={() => onHover(null)}
      elevation={0}
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        p: 2,
        cursor: 'pointer',
        border: `1px solid ${entry.isPast ? 'rgba(255,253,249,0.12)' : 'rgba(255,253,249,0.28)'}`,
        font: 'inherit',
        backgroundColor: entry.isPast ? 'rgba(255,253,249,0.05)' : 'rgba(255,253,249,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: isHighlighted ? `0 0 0 2px ${organicColors.blue.main}` : 'none',
        transition: 'box-shadow 0.15s ease'
      }}
    >
      <Stack spacing={1}>
        <Typography variant="caption" sx={{ color: mutedTextColor }}>
          {relativeLabel}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" gap={2}>
          <Stack spacing={0.25} minWidth={0}>
            <Typography variant="body1" fontWeight={600} noWrap sx={{ color: textColor }}>
              {entry.concept}
            </Typography>
            <Typography variant="body2" noWrap sx={{ color: mutedTextColor }}>
              {entry.accountName}
            </Typography>
          </Stack>
          <Typography variant="h6" component="p" sx={{ color: amountColor, flexShrink: 0 }}>
            {formatCurrency(entry.amount)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  )
}

import { Card, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { ProjectionStepListProps } from '../typings/props'

export function ProjectionStepList({ data }: ProjectionStepListProps): React.JSX.Element {
  const steps = [
    {
      label: 'Tenés hoy',
      value: data.todayBalance,
      color: 'text.primary' as const,
      showSign: false
    },
    {
      label: 'Te falta pagar',
      value: -data.pendingTotal,
      color: organicColors.orange.dark,
      showSign: true
    },
    {
      label: 'Va a entrar',
      value: data.expectedIncome,
      color: organicColors.sage.dark,
      showSign: true
    }
  ]

  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        {steps.map((step) => (
          <Stack key={step.label} direction="row" justifyContent="space-between">
            <Typography variant="body1">{step.label}</Typography>
            <Typography variant="body1" color={step.color}>
              {step.showSign ? (step.value >= 0 ? '+ ' : '− ') : ''}
              {formatCurrency(Math.abs(step.value))}
            </Typography>
          </Stack>
        ))}
        <Stack
          direction="row"
          justifyContent="space-between"
          pt={2}
          borderTop={`1px solid ${organicColors.neutral.border}`}
        >
          <Typography variant="h6" component="p">
            Queda el {data.endOfMonthLabel}
          </Typography>
          <Typography
            variant="h6"
            component="p"
            color={data.isPositive ? organicColors.sage.dark : organicColors.orange.dark}
          >
            {formatCurrency(data.endOfMonthBalance)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  )
}

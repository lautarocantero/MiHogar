import { Card, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { ProjectionRecommendationCardProps } from '../typings/props'

export function ProjectionRecommendationCard({
  data
}: ProjectionRecommendationCardProps): React.JSX.Element {
  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: data.isPositive ? organicColors.sage.tint : organicColors.orange.tint
      }}
      elevation={0}
    >
      <Typography
        variant="body1"
        sx={{ fontSize: '1.1875rem' }}
        color={data.isPositive ? organicColors.sage.dark : organicColors.orange.dark}
      >
        {data.isPositive
          ? `Vas a quedar con ${formatCurrency(data.endOfMonthBalance)} a favor. Podés pasar parte de ese saldo al plazo fijo si querés.`
          : `Te va a faltar ${formatCurrency(Math.abs(data.endOfMonthBalance))} para llegar a fin de mes. Revisá qué pagos podés mover o adelantar.`}
      </Typography>
    </Card>
  )
}

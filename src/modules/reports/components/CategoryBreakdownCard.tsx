import { Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { DonutChart } from '@/components/shared/DonutChart'
import type { CategoryBreakdownCardProps } from '../typings/props'

const CATEGORY_COLORS = ['#e2703a', '#e8b93f', '#2f8f8a', '#7a5aa8', '#3f6a8a', '#b7ada0']

export function CategoryBreakdownCard({ entries }: CategoryBreakdownCardProps): React.JSX.Element {
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Todavía no hay gastos este mes para mostrar por categoría.
      </Typography>
    )
  }

  const total = entries.reduce((sum, entry) => sum + entry.total, 0)
  const segments = entries.map((entry, index) => ({
    label: entry.categoryName,
    amountLabel: formatCurrency(entry.total),
    percent: entry.percent,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  }))

  return (
    <DonutChart
      segments={segments}
      centerValue={formatCurrency(total)}
      centerLabel="Total de gastos"
    />
  )
}

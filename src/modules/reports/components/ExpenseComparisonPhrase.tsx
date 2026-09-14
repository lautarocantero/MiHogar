import { Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { ExpenseComparisonPhraseProps } from '../typings/props'

export function ExpenseComparisonPhrase({
  comparison
}: ExpenseComparisonPhraseProps): React.JSX.Element {
  const verb = comparison.isIncrease ? 'más' : 'menos'
  const categoriesText =
    comparison.topChangedCategoryNames.length > 0
      ? ` La suba más grande fue en ${comparison.topChangedCategoryNames.join(' y en ')}.`
      : ''

  return (
    <Typography variant="body1">
      Este mes gastaste{' '}
      <strong>
        {formatCurrency(comparison.differenceAmount)} {verb}
      </strong>{' '}
      que el mes pasado.{categoriesText}
    </Typography>
  )
}

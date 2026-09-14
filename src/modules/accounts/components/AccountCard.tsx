import { Box, Card, Chip, Stack, Typography } from '@mui/material'
import { AccountType } from '@/typings/domain/enums'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { computeCreditCardInfoText } from '@/utils/domain/computeCreditCardInfoText'
import type { AccountCardProps } from '../typings/props'

const ACCOUNT_TYPE_BAR_COLOR: Record<AccountType, string> = {
  [AccountType.BANK]: organicColors.orange.main,
  [AccountType.CASH]: organicColors.sage.main,
  [AccountType.CREDIT_CARD]: organicColors.orange.dark
}

export function AccountCard({ account }: AccountCardProps): React.JSX.Element {
  const isNegativeBalance = account.balance < 0
  const creditCardInfoText =
    account.type === AccountType.CREDIT_CARD
      ? computeCreditCardInfoText(account.closingDay, account.dueDay, account.installmentsRemaining)
      : null

  return (
    <Card
      component="article"
      elevation={0}
      sx={{
        p: 3,
        borderLeft: `10px solid ${ACCOUNT_TYPE_BAR_COLOR[account.type]}`,
        height: '100%'
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" component="h3">
              {account.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {account.typeLabel}
            </Typography>
          </Box>
          <Chip
            label={account.ownerLabel}
            size="small"
            sx={{ backgroundColor: organicColors.orange.tint, color: organicColors.orange.dark }}
          />
        </Stack>
        <Typography
          variant="h4"
          component="p"
          color={isNegativeBalance ? organicColors.orange.dark : 'text.primary'}
        >
          {formatCurrency(account.balance)}
        </Typography>
        {account.contextPhrase && (
          <Typography variant="body2" color="text.secondary">
            {account.contextPhrase}
          </Typography>
        )}
        {creditCardInfoText && (
          <Typography variant="body2" color="text.secondary">
            {creditCardInfoText}
          </Typography>
        )}
      </Stack>
    </Card>
  )
}

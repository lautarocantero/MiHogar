import { useState } from 'react'
import { Box, Card, Chip, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
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

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps): React.JSX.Element {
  const isNegativeBalance = account.balance < 0
  const creditCardInfoText =
    account.type === AccountType.CREDIT_CARD
      ? computeCreditCardInfoText(account.closingDay, account.dueDay, account.installmentsRemaining)
      : null
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

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
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Chip
              label={account.ownerLabel}
              size="small"
              sx={{ backgroundColor: organicColors.orange.tint, color: organicColors.orange.dark }}
            />
            <IconButton
              size="small"
              aria-label={`Opciones de ${account.name}`}
              onClick={(event) => setMenuAnchor(event.currentTarget)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null)
                  onEdit()
                }}
              >
                Editar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null)
                  onDelete()
                }}
              >
                Eliminar
              </MenuItem>
            </Menu>
          </Stack>
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

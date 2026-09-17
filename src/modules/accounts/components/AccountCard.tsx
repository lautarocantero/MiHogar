import { useState } from 'react'
import { Box, Card, Chip, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { AccountType } from '@/typings/domain/enums'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { computeCreditCardInfoText } from '@/utils/domain/computeCreditCardInfoText'
import { computeSingleCardAvailable } from '@/utils/domain/computeCreditCardAvailable'
import { resolveAccountTypeColor } from '@/utils/domain/resolveAccountTypeColor'
import type { AccountCardProps } from '../typings/props'

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps): React.JSX.Element {
  const isCreditCard = account.type === AccountType.CREDIT_CARD
  const isNegativeBalance = !isCreditCard && account.balance < 0
  const typeColor = resolveAccountTypeColor(account.type)
  const creditCardInfoText = isCreditCard
    ? computeCreditCardInfoText(account.closingDay, account.dueDay)
    : null
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

  return (
    <Card
      component="article"
      elevation={0}
      sx={{
        p: 3,
        borderLeft: `10px solid ${typeColor.main}`,
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
          {formatCurrency(isCreditCard ? computeSingleCardAvailable(account) : account.balance)}
        </Typography>
        {isCreditCard && (
          <Typography variant="body2" color="text.secondary">
            Disponible de {formatCurrency(account.creditLimit ?? 0)}
            {account.usedAmount ? ` · usaste ${formatCurrency(account.usedAmount)}` : ''}
          </Typography>
        )}
        {isCreditCard && account.sourceAccountName && (
          <Typography variant="body2" color="text.secondary">
            Sale de {account.sourceAccountName}
          </Typography>
        )}
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

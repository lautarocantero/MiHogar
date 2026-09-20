import { useState } from 'react'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { AccountType } from '@/typings/domain/enums'
import { organicColors, organicTypography, sidebarColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { Account } from '@/typings/domain/types'
import type { AccountView } from './typings/types'
import twigPattern from '@/assets/images/twig-pattern.png'
import { AccountCard } from './components/AccountCard'
import { AddAccountDialog } from './components/AddAccountDialog'
import { EditAccountDialog } from './components/EditAccountDialog'
import { DeleteAccountDialog } from './components/DeleteAccountDialog'
import { useAccountsData } from './useAccountsData'
import { useReorderAccounts } from './useReorderAccounts'

export function AccountsPage(): React.JSX.Element {
  const { totalAvailable, totalCreditAvailable, accountViews } = useAccountsData()
  const reorderAccounts = useReorderAccounts()
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const cardAccounts = accountViews.filter((account) => account.type === AccountType.CREDIT_CARD)
  const otherAccounts = accountViews.filter((account) => account.type !== AccountType.CREDIT_CARD)

  const handleDrop = (list: AccountView[], targetId: string): void => {
    if (!draggedId || draggedId === targetId) return
    const ids = list.map((account) => account.id)
    const fromIndex = ids.indexOf(draggedId)
    const toIndex = ids.indexOf(targetId)
    if (fromIndex === -1 || toIndex === -1) return
    ids.splice(fromIndex, 1)
    ids.splice(toIndex, 0, draggedId)
    reorderAccounts(ids)
    setDraggedId(null)
  }

  return (
    <Box
      component="section"
      aria-label="Cuentas y tarjetas"
      sx={{ display: 'flex', gap: 3, alignItems: 'stretch', height: '100%' }}
    >
      <Stack spacing={3} flexGrow={1} minWidth={0} height="100%" minHeight={0}>
        <Card
          sx={{
            p: 3,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 3,
            backgroundColor: organicColors.orange.tint,
            flexShrink: 0
          }}
          elevation={0}
        >
          <Box flexGrow={1}>
            <Typography variant="body2" color="text.secondary">
              Sumando todo lo que tenés
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.875rem',
                color: organicColors.orange.dark
              }}
            >
              {formatCurrency(totalAvailable)}
            </Typography>
          </Box>
          <Box flexGrow={1}>
            <Typography variant="body2" color="text.secondary">
              Disponible en tarjetas
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.875rem',
                color: organicColors.orange.dark
              }}
            >
              {formatCurrency(totalCreditAvailable)}
            </Typography>
          </Box>
        </Card>

        <Typography
          component="h2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.375rem',
            fontWeight: 400,
            color: organicColors.orange.dark,
            flexShrink: 0
          }}
        >
          <AccountBalanceIcon aria-hidden="true" />
          Cuentas
        </Typography>

        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
          <Stack spacing={1.5}>
            <Box
              component="button"
              type="button"
              onClick={() => setIsAddAccountOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                p: 2.25,
                minHeight: 64,
                width: '100%',
                cursor: 'pointer',
                font: 'inherit',
                borderRadius: 0,
                border: `1.5px dashed ${organicColors.neutral.border}`,
                backgroundColor: 'transparent',
                color: organicColors.orange.dark,
                '&:hover': { backgroundColor: organicColors.orange.tint }
              }}
            >
              <AddIcon fontSize="small" />
              <Typography variant="body1" sx={{ color: 'inherit' }}>
                Agregar una cuenta
              </Typography>
            </Box>

            {otherAccounts.map((account) => (
              <Box
                key={account.id}
                draggable
                onDragStart={() => setDraggedId(account.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(otherAccounts, account.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 0.5,
                  opacity: draggedId === account.id ? 0.5 : 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: organicColors.neutral.textSecondary,
                    cursor: 'grab',
                    px: 0.25
                  }}
                >
                  <DragIndicatorIcon fontSize="small" />
                </Box>
                <Box flexGrow={1} minWidth={0}>
                  <AccountCard
                    account={account}
                    onEdit={() => setEditingAccount(account)}
                    onDelete={() => setDeletingAccount(account)}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: 340,
          flexShrink: 0,
          background: sidebarColors.gradient,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${twigPattern})`,
            backgroundSize: 520,
            backgroundRepeat: 'repeat',
            filter: 'invert(1) grayscale(1) contrast(0.9)',
            mixBlendMode: 'screen',
            opacity: sidebarColors.patternOpacity,
            pointerEvents: 'none'
          }}
        />
        <Typography
          component="h2"
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.375rem',
            fontWeight: 400,
            color: sidebarColors.onDark
          }}
        >
          <CreditCardIcon aria-hidden="true" />
          Tarjetas
        </Typography>
        <Stack
          spacing={2}
          sx={{ position: 'relative', flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setIsAddAccountOpen(true)}
            sx={{
              cursor: 'pointer',
              borderStyle: 'dashed',
              borderColor: 'rgba(255,253,249,0.45)',
              color: sidebarColors.onDark,
              '&:hover': {
                backgroundColor: 'rgba(255,253,249,0.12)',
                borderColor: 'rgba(255,253,249,0.45)'
              }
            }}
          >
            Agregar una tarjeta
          </Button>
          {cardAccounts.map((account) => (
            <Box
              key={account.id}
              draggable
              onDragStart={() => setDraggedId(account.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(cardAccounts, account.id)}
              sx={{ opacity: draggedId === account.id ? 0.5 : 1, cursor: 'pointer' }}
            >
              <AccountCard
                account={account}
                onEdit={() => setEditingAccount(account)}
                onDelete={() => setDeletingAccount(account)}
              />
            </Box>
          ))}
        </Stack>
      </Box>

      <AddAccountDialog open={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} />
      {editingAccount && (
        <EditAccountDialog
          account={editingAccount}
          open={Boolean(editingAccount)}
          onClose={() => setEditingAccount(null)}
        />
      )}
      {deletingAccount && (
        <DeleteAccountDialog
          account={deletingAccount}
          open={Boolean(deletingAccount)}
          onClose={() => setDeletingAccount(null)}
        />
      )}
    </Box>
  )
}

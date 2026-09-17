import { useState } from 'react'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Grid from '@mui/material/Grid2'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { Account } from '@/typings/domain/types'
import { AccountCard } from './components/AccountCard'
import { AddAccountDialog } from './components/AddAccountDialog'
import { EditAccountDialog } from './components/EditAccountDialog'
import { DeleteAccountDialog } from './components/DeleteAccountDialog'
import { useAccountsData } from './useAccountsData'

export function AccountsPage(): React.JSX.Element {
  const { totalAvailable, totalCreditAvailable, accountViews } = useAccountsData()
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)

  return (
    <Stack spacing={4} component="section" aria-label="Cuentas y tarjetas">
      <Card
        sx={{
          p: 3,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 3,
          backgroundColor: organicColors.surface
        }}
        elevation={0}
      >
        <Box flexGrow={1}>
          <Typography variant="body2" color="text.secondary">
            Sumando todo lo que tenés
          </Typography>
          <Typography variant="h4" component="p">
            {formatCurrency(totalAvailable)}
          </Typography>
        </Box>
        <Box flexGrow={1}>
          <Typography variant="body2" color="text.secondary">
            Disponible en tarjetas
          </Typography>
          <Typography variant="h4" component="p" color={organicColors.orange.dark}>
            {formatCurrency(totalCreditAvailable)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setIsAddAccountOpen(true)}
        >
          Agregar una cuenta
        </Button>
      </Card>

      {accountViews.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Todavía no agregaste ninguna cuenta.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {accountViews.map((account) => (
            <Grid key={account.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <AccountCard
                account={account}
                onEdit={() => setEditingAccount(account)}
                onDelete={() => setDeletingAccount(account)}
              />
            </Grid>
          ))}
        </Grid>
      )}

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
    </Stack>
  )
}

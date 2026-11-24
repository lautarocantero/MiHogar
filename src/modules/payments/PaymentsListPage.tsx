import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TuneIcon from '@mui/icons-material/Tune'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { Movement } from '@/typings/domain/types'
import { EditMovementDialog } from '@/modules/timeline/components/EditMovementDialog'
import { DeleteMovementDialog } from '@/modules/timeline/components/DeleteMovementDialog'
import { LeafButton } from '@/components/shared/LeafButton'
import { useResponsive } from '@/hooks/shared/useResponsive'
import { ROUTES } from '@/router/routes'
import { PaymentsTable } from './components/PaymentsTable'
import { EditPaymentDialog } from './components/EditPaymentDialog'
import { DeletePaymentDialog } from './components/DeletePaymentDialog'
import { usePaymentFilters } from './hooks/usePaymentFilters'
import {
  PaymentFilter,
  PaymentMethodFilter,
  PaymentSortBy,
  PaymentTypeFilter
} from './typings/enums'
import type { PaymentColumnKey } from './typings/props'
import type { PaymentView } from './typings/types'
import { useT } from '@/i18n'

const ALL = 'ALL'

// En teléfonos los filtros van de a dos por fila; desde `sm` recuperan su ancho mínimo.
const FILTER_FIELD_SX = {
  minWidth: { xs: 0, sm: 160 },
  flex: { xs: '1 1 calc(50% - 12px)', sm: '0 0 auto' }
} as const
const FILTER_FIELD_WIDE_SX = { ...FILTER_FIELD_SX, minWidth: { xs: 0, sm: 180 } } as const

// En teléfonos la tabla arranca con menos columnas (se pueden volver a mostrar).
const DEFAULT_HIDDEN_COLUMNS: PaymentColumnKey[] = ['mode']
const DEFAULT_HIDDEN_COLUMNS_PHONE: PaymentColumnKey[] = [
  'mode',
  'method',
  'type',
  'category',
  'owner'
]

const COLUMN_TOGGLES: Array<{ key: PaymentColumnKey; labelKey: string }> = [
  { key: 'date', labelKey: 'payments.column.date' },
  { key: 'title', labelKey: 'payments.column.title' },
  { key: 'status', labelKey: 'payments.column.status' },
  { key: 'method', labelKey: 'payments.column.method' },
  { key: 'type', labelKey: 'payments.column.type' },
  { key: 'account', labelKey: 'payments.column.account' },
  { key: 'category', labelKey: 'payments.column.category' },
  { key: 'owner', labelKey: 'payments.column.owner' },
  { key: 'mode', labelKey: 'payments.column.mode' }
]

type PaymentsListLocationState = { focusEntryId?: string } | null

export function PaymentsListPage(): React.JSX.Element {
  const t = useT()
  const location = useLocation()
  const navigate = useNavigate()
  const focusEntryId = (location.state as PaymentsListLocationState)?.focusEntryId ?? null
  const {
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    methodFilter,
    setMethodFilter,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    categoryFilter,
    setCategoryFilter,
    ownerFilter,
    setOwnerFilter,
    accountOptions,
    categoryOptions,
    ownerOptions,
    filteredEntries,
    totalAmount
  } = usePaymentFilters(focusEntryId ? PaymentFilter.ALL : PaymentFilter.PENDING)
  const [editingPayment, setEditingPayment] = useState<PaymentView | null>(null)
  const [deletingPayment, setDeletingPayment] = useState<PaymentView | null>(null)
  const [editingMovement, setEditingMovement] = useState<Movement | null>(null)
  const [deletingMovement, setDeletingMovement] = useState<Movement | null>(null)
  const { isPhone } = useResponsive()
  const [hiddenColumns, setHiddenColumns] = useState<Set<PaymentColumnKey>>(
    () => new Set(isPhone ? DEFAULT_HIDDEN_COLUMNS_PHONE : DEFAULT_HIDDEN_COLUMNS)
  )
  const [columnsOpen, setColumnsOpen] = useState(false)

  const toggleColumn = (key: PaymentColumnKey): void =>
    setHiddenColumns((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })

  return (
    <Stack spacing={{ xs: 3, md: 4 }} component="section" aria-label={t('payments.pageLabel')}>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: { xs: 2, sm: 3 },
          backgroundColor: organicColors.orange.tint
        }}
        elevation={0}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            flexShrink: 0,
            backgroundColor: '#f8dcca',
            color: organicColors.orange.dark
          }}
        >
          <AccountBalanceWalletIcon />
        </Box>
        <Box minWidth={0}>
          <Typography variant="body2" color="text.secondary">
            {t('payments.filteredTotal')}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontFamily: organicTypography.titleFontFamily,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              overflowWrap: 'anywhere',
              color: organicColors.orange.dark
            }}
          >
            {formatCurrency(totalAmount)}
          </Typography>
        </Box>
      </Card>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-end"
        flexWrap="wrap"
        useFlexGap
        sx={{ position: 'relative' }}
      >
        <TextField
          label={t('payments.filter.sortBy')}
          select
          size="small"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as PaymentSortBy)}
          sx={FILTER_FIELD_SX}
        >
          <MenuItem value={PaymentSortBy.DATE}>{t('payments.filter.sortDate')}</MenuItem>
          <MenuItem value={PaymentSortBy.AMOUNT}>{t('payments.filter.sortAmount')}</MenuItem>
        </TextField>
        <TextField
          label={t('payments.filter.status')}
          select
          size="small"
          value={activeFilter}
          onChange={(event) => setActiveFilter(event.target.value as PaymentFilter)}
          sx={FILTER_FIELD_SX}
        >
          <MenuItem value={PaymentFilter.PENDING}>{t('payments.filter.pending')}</MenuItem>
          <MenuItem value={PaymentFilter.PAID}>{t('payments.filter.paid')}</MenuItem>
          <MenuItem value={PaymentFilter.ALL}>{t('payments.filter.all')}</MenuItem>
        </TextField>
        <TextField
          label={t('payments.filter.method')}
          select
          size="small"
          value={methodFilter}
          onChange={(event) => setMethodFilter(event.target.value as PaymentMethodFilter)}
          sx={FILTER_FIELD_WIDE_SX}
        >
          <MenuItem value={PaymentMethodFilter.ALL}>{t('payments.filter.allMethods')}</MenuItem>
          <MenuItem value={PaymentMethodFilter.CASH}>{t('payments.method.cash')}</MenuItem>
          <MenuItem value={PaymentMethodFilter.CREDIT_CARD}>{t('payments.method.card')}</MenuItem>
        </TextField>
        <TextField
          label={t('payments.filter.type')}
          select
          size="small"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as PaymentTypeFilter)}
          sx={FILTER_FIELD_SX}
        >
          <MenuItem value={PaymentTypeFilter.ALL}>{t('payments.filter.all')}</MenuItem>
          <MenuItem value={PaymentTypeFilter.RECURRING}>{t('payments.type.recurring')}</MenuItem>
          <MenuItem value={PaymentTypeFilter.ONE_OFF}>{t('payments.type.oneOff')}</MenuItem>
        </TextField>
        <TextField
          label={t('payments.filter.account')}
          select
          size="small"
          value={accountFilter}
          onChange={(event) => setAccountFilter(event.target.value)}
          sx={FILTER_FIELD_WIDE_SX}
        >
          <MenuItem value={ALL}>{t('payments.filter.allAccounts')}</MenuItem>
          {accountOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('payments.filter.category')}
          select
          size="small"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          sx={FILTER_FIELD_WIDE_SX}
        >
          <MenuItem value={ALL}>{t('payments.filter.allCategories')}</MenuItem>
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('payments.filter.owner')}
          select
          size="small"
          value={ownerFilter}
          onChange={(event) => setOwnerFilter(event.target.value)}
          sx={FILTER_FIELD_SX}
        >
          <MenuItem value={ALL}>{t('payments.filter.all')}</MenuItem>
          {ownerOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <LeafButton
          size="small"
          startIcon={<UploadFileIcon />}
          onClick={() => navigate(ROUTES.IMPORT_STATEMENTS)}
          sx={{ ml: 'auto' }}
        >
          {t('payments.importStatement')}
        </LeafButton>

        {/* En teléfonos el menú de columnas se ancla a la fila completa (no al botón) para
            no salirse de la pantalla. */}
        <Box sx={{ position: { xs: 'static', sm: 'relative' } }}>
          <Button
            size="small"
            startIcon={<TuneIcon />}
            onClick={() => setColumnsOpen((prev) => !prev)}
            sx={{ color: 'text.secondary' }}
          >
            {t('payments.columns')}{' '}
            <Box component="span" sx={{ ml: 0.5, color: organicColors.neutral.textSecondary }}>
              {COLUMN_TOGGLES.length - hiddenColumns.size}
            </Box>
          </Button>
          {columnsOpen && (
            <ClickAwayListener onClickAway={() => setColumnsOpen(false)}>
              <Card
                elevation={3}
                sx={{
                  position: 'absolute',
                  right: 0,
                  left: { xs: 0, sm: 'auto' },
                  top: 'calc(100% + 6px)',
                  zIndex: 20,
                  minWidth: 220,
                  p: 1
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                  {t('payments.visibleColumns')}
                </Typography>
                <Stack>
                  {COLUMN_TOGGLES.map((column) => (
                    <FormControlLabel
                      key={column.key}
                      sx={{ mx: 0 }}
                      control={
                        <Checkbox
                          size="small"
                          checked={!hiddenColumns.has(column.key)}
                          onChange={() => toggleColumn(column.key)}
                        />
                      }
                      label={<Typography variant="body2">{t(column.labelKey)}</Typography>}
                    />
                  ))}
                </Stack>
              </Card>
            </ClickAwayListener>
          )}
        </Box>
      </Stack>

      {filteredEntries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          {t('payments.empty')}
        </Typography>
      ) : (
        <PaymentsTable
          entries={filteredEntries}
          focusEntryId={focusEntryId}
          hiddenColumns={hiddenColumns}
          onEditPayment={setEditingPayment}
          onDeletePayment={setDeletingPayment}
          onEditMovement={setEditingMovement}
          onDeleteMovement={setDeletingMovement}
        />
      )}

      {editingPayment && (
        <EditPaymentDialog
          payment={editingPayment}
          open={Boolean(editingPayment)}
          onClose={() => setEditingPayment(null)}
        />
      )}
      {deletingPayment && (
        <DeletePaymentDialog
          payment={deletingPayment}
          open={Boolean(deletingPayment)}
          onClose={() => setDeletingPayment(null)}
          onDeleted={() => setDeletingPayment(null)}
        />
      )}
      {editingMovement && (
        <EditMovementDialog
          movement={editingMovement}
          open={Boolean(editingMovement)}
          onClose={() => setEditingMovement(null)}
        />
      )}
      {deletingMovement && (
        <DeleteMovementDialog
          movement={deletingMovement}
          open={Boolean(deletingMovement)}
          onClose={() => setDeletingMovement(null)}
        />
      )}
    </Stack>
  )
}

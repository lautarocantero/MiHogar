import { useEffect, useRef } from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { PaymentTableRow } from './PaymentTableRow'
import type { PaymentColumnKey, PaymentsTableProps } from '../typings/props'
import { useT } from '@/i18n'

const HEADERS: Array<{ key: PaymentColumnKey; labelKey: string }> = [
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

export function PaymentsTable({
  entries,
  focusEntryId,
  hiddenColumns,
  onEditPayment,
  onDeletePayment,
  onEditMovement,
  onDeleteMovement
}: PaymentsTableProps): React.JSX.Element {
  const t = useT()
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>())

  useEffect(() => {
    if (!focusEntryId) return
    rowRefs.current.get(focusEntryId)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [focusEntryId, entries])

  return (
    <TableContainer
      component={Card}
      elevation={0}
      sx={{ border: `1px solid ${organicColors.brown.main}` }}
    >
      <Table
        size="small"
        sx={(theme) => ({
          borderCollapse: 'collapse',
          '& .MuiTableCell-root': {
            border: `1px solid ${organicColors.brown.main}`
          },
          // En teléfonos cada fila ocupa una línea y la tabla scrollea en horizontal dentro
          // de su contenedor, en vez de apretar las columnas en filas altísimas.
          [theme.breakpoints.down('sm')]: {
            '& .MuiTableCell-root': { whiteSpace: 'nowrap' }
          }
        })}
      >
        <TableHead>
          <TableRow>
            {HEADERS.filter((header) => !hiddenColumns.has(header.key)).map((header) => (
              <TableCell
                key={header.key}
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  color: '#fffdf9',
                  backgroundColor: organicColors.brown.main,
                  whiteSpace: 'nowrap'
                }}
              >
                {t(header.labelKey)}
              </TableCell>
            ))}
            <TableCell
              align="right"
              sx={{ backgroundColor: organicColors.brown.main, color: '#fffdf9', fontWeight: 600 }}
            >
              {t('payments.column.amount')}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: organicColors.brown.main, color: '#fffdf9', fontWeight: 600 }}
            >
              {t('payments.column.actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <PaymentTableRow
              key={entry.id}
              entry={entry}
              isFocused={entry.id === focusEntryId}
              hiddenColumns={hiddenColumns}
              rowRef={(node) => {
                if (node) {
                  rowRefs.current.set(entry.id, node)
                } else {
                  rowRefs.current.delete(entry.id)
                }
              }}
              onEditPayment={onEditPayment}
              onDeletePayment={onDeletePayment}
              onEditMovement={onEditMovement}
              onDeleteMovement={onDeleteMovement}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

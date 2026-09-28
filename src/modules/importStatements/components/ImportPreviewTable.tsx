import {
  Checkbox,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatShortDate } from '@/utils/formatting/formatDate'
import { CategoryField } from '@/components/shared/CategoryField'
import { CategoryKind, MovementType } from '@/typings/domain/enums'
import type { PreviewRow } from '../typings/importStatements.types'

type ImportPreviewTableProps = {
  rows: PreviewRow[]
  onToggleIncluded: (rowId: string) => void
  onCategoryChange: (rowId: string, categoryId: string) => void
  onRememberCategory: (rowId: string) => void
  isCategoryRemembered: (rowId: string) => boolean
}

export function ImportPreviewTable({
  rows,
  onToggleIncluded,
  onCategoryChange,
  onRememberCategory,
  isCategoryRemembered
}: ImportPreviewTableProps): React.JSX.Element {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">Incluir</TableCell>
          <TableCell>Fecha</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell align="right">Monto</TableCell>
          <TableCell>Categoría</TableCell>
          <TableCell>Aviso</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.rowId} sx={{ opacity: row.invalid ? 0.5 : 1 }}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={row.included}
                disabled={row.invalid}
                onChange={() => onToggleIncluded(row.rowId)}
              />
            </TableCell>
            <TableCell>{formatShortDate(row.date)}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <CategoryField
                  kind={
                    row.type === MovementType.INCOME ? CategoryKind.INCOME : CategoryKind.EXPENSE
                  }
                  value={row.categoryId}
                  onChange={(categoryId) => onCategoryChange(row.rowId, categoryId)}
                  error={row.included && !row.invalid && !row.categoryId}
                />
                <Tooltip
                  title={
                    isCategoryRemembered(row.rowId)
                      ? 'Concepto establecido para esta descripción'
                      : 'Establecer concepto para futuras boletas con esta descripción'
                  }
                >
                  <span>
                    <IconButton
                      size="small"
                      disabled={!row.categoryId}
                      onClick={() => onRememberCategory(row.rowId)}
                      aria-label="Establecer concepto"
                    >
                      {isCategoryRemembered(row.rowId) ? (
                        <BookmarkAddedIcon fontSize="small" color="primary" />
                      ) : (
                        <BookmarkAddOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </TableCell>
            <TableCell>
              {row.invalid && <Chip size="small" color="error" label="Fila inválida" />}
              {!row.invalid && row.likelyDuplicate && (
                <Chip size="small" color="warning" label="Probable duplicado" />
              )}
            </TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>
              <Typography variant="body2" color="text.secondary">
                No se detectaron filas en el archivo.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

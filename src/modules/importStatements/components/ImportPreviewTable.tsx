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
import { useT } from '@/i18n'
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
  const t = useT()
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">{t('importStatements.preview.col.include')}</TableCell>
          <TableCell>{t('importStatements.preview.col.date')}</TableCell>
          <TableCell>{t('importStatements.preview.col.description')}</TableCell>
          <TableCell align="right">{t('importStatements.preview.col.amount')}</TableCell>
          <TableCell>{t('importStatements.preview.col.category')}</TableCell>
          <TableCell>{t('importStatements.preview.col.notice')}</TableCell>
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
                inputProps={{
                  'aria-label': t('importStatements.preview.includeRow', {
                    description: row.description
                  })
                }}
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
                      ? t('importStatements.preview.rememberCategory.done')
                      : t('importStatements.preview.rememberCategory.hint')
                  }
                >
                  <span>
                    <IconButton
                      size="small"
                      disabled={!row.categoryId}
                      onClick={() => onRememberCategory(row.rowId)}
                      aria-label={t('importStatements.preview.rememberCategory')}
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
              {row.invalid && (
                <Chip size="small" color="error" label={t('importStatements.preview.invalidRow')} />
              )}
              {!row.invalid && row.likelyDuplicate && (
                <Chip
                  size="small"
                  color="warning"
                  label={t('importStatements.preview.likelyDuplicate')}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>
              <Typography variant="body2" color="text.secondary">
                {t('importStatements.preview.empty')}
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

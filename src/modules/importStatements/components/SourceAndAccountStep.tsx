import { MenuItem, Stack, TextField } from '@mui/material'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { useT } from '@/i18n'
import type { StatementFileFormat, StatementSource } from '../typings/importStatements.types'

/** Nombres propios de cada entidad: no se traducen. */
const SOURCE_LABELS: Record<StatementSource, string> = {
  MERCADO_PAGO: 'Mercado Pago',
  GALICIA: 'Banco Galicia'
}

const FORMATS: StatementFileFormat[] = ['PDF', 'EXCEL_CSV']

type SourceAndAccountStepProps = {
  source: StatementSource
  onSourceChange: (source: StatementSource) => void
  format: StatementFileFormat
  onFormatChange: (format: StatementFileFormat) => void
  accountId: string
  onAccountChange: (accountId: string) => void
}

export function SourceAndAccountStep({
  source,
  onSourceChange,
  format,
  onFormatChange,
  accountId,
  onAccountChange
}: SourceAndAccountStepProps): React.JSX.Element {
  const t = useT()
  const accounts = useAppSelector(selectAllAccounts)

  return (
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      <TextField
        label={t('importStatements.field.source')}
        select
        value={source}
        onChange={(event) => onSourceChange(event.target.value as StatementSource)}
        sx={{ minWidth: 200 }}
      >
        {Object.entries(SOURCE_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('importStatements.field.format')}
        select
        value={format}
        onChange={(event) => onFormatChange(event.target.value as StatementFileFormat)}
        sx={{ minWidth: 180 }}
      >
        {FORMATS.map((value) => (
          <MenuItem key={value} value={value}>
            {t(`importStatements.format.${value}`)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('importStatements.field.account')}
        select
        value={accountId}
        onChange={(event) => onAccountChange(event.target.value)}
        sx={{ minWidth: 220 }}
      >
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  )
}

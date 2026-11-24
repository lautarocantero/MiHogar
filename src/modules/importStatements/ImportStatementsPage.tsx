import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Stack, Typography } from '@mui/material'
import { FormSectionHeader } from '@/components/shared/FormSectionHeader'
import { LeafButton } from '@/components/shared/LeafButton'
import { useT } from '@/i18n'
import { ROUTES } from '@/router/routes'
import { SourceAndAccountStep } from './components/SourceAndAccountStep'
import { ImportPreviewTable } from './components/ImportPreviewTable'
import { StatementFileInput } from './components/StatementFileInput'
import { useImportMovements } from './useImportMovements'
import type { StatementFileFormat, StatementSource } from './typings/importStatements.types'

export function ImportStatementsPage(): React.JSX.Element {
  const navigate = useNavigate()
  const t = useT()
  const [source, setSource] = useState<StatementSource>('MERCADO_PAGO')
  const [format, setFormat] = useState<StatementFileFormat>('PDF')
  const [accountId, setAccountId] = useState('')
  const {
    isLoading,
    error,
    rows,
    hasRows,
    canConfirm,
    parseFile,
    toggleIncluded,
    setCategory,
    rememberCategory,
    isCategoryRemembered,
    confirm
  } = useImportMovements()

  const goBackToPayments = (): void => navigate(ROUTES.PAYMENTS)

  return (
    <Stack spacing={3} component="section" aria-label={t('importStatements.title')}>
      <FormSectionHeader
        step={1}
        title={t('importStatements.title')}
        subtitle={t('importStatements.subtitle')}
      />

      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <SourceAndAccountStep
            source={source}
            onSourceChange={setSource}
            format={format}
            onFormatChange={setFormat}
            accountId={accountId}
            onAccountChange={setAccountId}
          />
          <StatementFileInput
            format={format}
            disabled={!accountId || isLoading}
            isLoading={isLoading}
            needsAccount={!accountId}
            onFileSelected={(file) => parseFile(file, source, format, accountId)}
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Card>

      {hasRows && (
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6" component="h2">
              {t('importStatements.preview.title')}
            </Typography>
            <ImportPreviewTable
              rows={rows}
              onToggleIncluded={toggleIncluded}
              onCategoryChange={setCategory}
              onRememberCategory={rememberCategory}
              isCategoryRemembered={isCategoryRemembered}
            />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" disabled={isLoading} onClick={goBackToPayments}>
                {t('common.cancel')}
              </Button>
              <LeafButton
                disabled={!canConfirm || isLoading}
                onClick={() => confirm(accountId, goBackToPayments)}
              >
                {t('importStatements.confirm')}
              </LeafButton>
            </Stack>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}

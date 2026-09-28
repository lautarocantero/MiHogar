import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Stack, Typography } from '@mui/material'
import { FormSectionHeader } from '@/components/shared/FormSectionHeader'
import { LeafButton } from '@/components/shared/LeafButton'
import { ROUTES } from '@/router/routes'
import { SourceAndAccountStep } from './components/SourceAndAccountStep'
import { ImportPreviewTable } from './components/ImportPreviewTable'
import { useImportMovements } from './useImportMovements'
import type { StatementFileFormat, StatementSource } from './typings/importStatements.types'

export function ImportStatementsPage(): React.JSX.Element {
  const navigate = useNavigate()
  const [source, setSource] = useState<StatementSource>('MERCADO_PAGO')
  const [format, setFormat] = useState<StatementFileFormat>('PDF')
  const [accountId, setAccountId] = useState('')
  const {
    isLoading,
    error,
    rows,
    hasRows,
    canConfirm,
    pickAndParseFile,
    toggleIncluded,
    setCategory,
    rememberCategory,
    isCategoryRemembered,
    confirm
  } = useImportMovements()

  const goBackToPayments = (): void => navigate(ROUTES.PAYMENTS)

  return (
    <Stack spacing={3} component="section" aria-label="Importar boleta">
      <FormSectionHeader
        step={1}
        title="Importar boleta"
        subtitle="Elegí la fuente, la cuenta destino y subí el archivo del resumen"
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
          <LeafButton
            disabled={!accountId || isLoading}
            onClick={() => pickAndParseFile(source, format, accountId)}
            sx={{ alignSelf: 'flex-start' }}
          >
            Subir archivo
          </LeafButton>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Card>

      {hasRows && (
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Previsualización</Typography>
            <ImportPreviewTable
              rows={rows}
              onToggleIncluded={toggleIncluded}
              onCategoryChange={setCategory}
              onRememberCategory={rememberCategory}
              isCategoryRemembered={isCategoryRemembered}
            />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button variant="outlined" disabled={isLoading} onClick={goBackToPayments}>
                Cancelar
              </Button>
              <LeafButton
                disabled={!canConfirm || isLoading}
                onClick={() => confirm(accountId, goBackToPayments)}
              >
                Confirmar importación
              </LeafButton>
            </Stack>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}

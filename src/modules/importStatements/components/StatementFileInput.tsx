import { useId, useRef } from 'react'
import { Stack, Typography } from '@mui/material'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import { LeafButton } from '@/components/shared/LeafButton'
import { useT } from '@/i18n'
import { getAcceptAttribute, MAX_STATEMENT_FILE_MB } from '../parseStatementFile'
import type { StatementFileFormat } from '../typings/importStatements.types'

/** Oculto a la vista pero presente en el DOM (el botón visible lo dispara). */
const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0
} as const

type StatementFileInputProps = {
  format: StatementFileFormat
  disabled: boolean
  isLoading: boolean
  /** `true` cuando falta elegir la cuenta destino (explica por qué el botón está deshabilitado). */
  needsAccount: boolean
  onFileSelected: (file: File) => void
}

/**
 * Selector de archivo de boleta del navegador (reemplaza al `dialog` de Electron). El
 * `<input type="file">` nativo queda oculto y lo abre un botón con el estilo de la app; el
 * texto de ayuda (formatos y tamaño máximo) está asociado con `aria-describedby`.
 */
export function StatementFileInput({
  format,
  disabled,
  isLoading,
  needsAccount,
  onFileSelected
}: StatementFileInputProps): React.JSX.Element {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const hintId = useId()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    // Se limpia para que volver a elegir el mismo archivo dispare `change` otra vez.
    event.target.value = ''
    if (file) onFileSelected(file)
  }

  const hint = needsAccount
    ? t('importStatements.upload.hint.noAccount')
    : t(`importStatements.upload.hint.${format}`, { maxMb: MAX_STATEMENT_FILE_MB })

  return (
    <Stack spacing={0.75} alignItems="flex-start">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={getAcceptAttribute(format)}
        onChange={handleChange}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        style={visuallyHidden}
      />
      <LeafButton
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        startIcon={<UploadFileOutlinedIcon />}
        aria-describedby={hintId}
        aria-busy={isLoading}
      >
        {t('importStatements.upload.button')}
      </LeafButton>
      <Typography id={hintId} variant="caption" color="text.secondary">
        {hint}
      </Typography>
    </Stack>
  )
}

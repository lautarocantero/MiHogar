import { Alert, Button, Card, Stack, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { useExportImportVault } from '../useExportImportVault'

export function ExportImportButtons(): React.JSX.Element {
  const { exportBackup, importBackup, isLoading, errorMessage, message } = useExportImportVault()

  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Respaldo de tus datos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Guardá una copia de tus datos en otra carpeta, o traé una copia guardada antes.
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportBackup}
            disabled={isLoading}
          >
            Exportar un respaldo
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={importBackup}
            disabled={isLoading}
          >
            Importar un respaldo
          </Button>
        </Stack>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
      </Stack>
    </Card>
  )
}

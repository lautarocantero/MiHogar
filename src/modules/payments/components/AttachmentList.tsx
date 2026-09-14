import { useRef } from 'react'
import { Alert, Button, Stack, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { AttachmentItem } from './AttachmentItem'
import { useAttachments } from '../hooks/useAttachments'
import type { AttachmentListProps } from '../typings/props'

export function AttachmentList({ payment }: AttachmentListProps): React.JSX.Element {
  const { uploadFile, openFile, removeFile, isLoading, errorMessage } = useAttachments(payment)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h3">
        Papeles guardados
      </Typography>
      {payment.attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Todavía no guardaste ningún comprobante para este pago.
        </Typography>
      ) : (
        <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {payment.attachments.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              attachment={attachment}
              onOpen={openFile}
              onRemove={removeFile}
            />
          ))}
        </Stack>
      )}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Button
        variant="outlined"
        startIcon={<UploadFileIcon />}
        disabled={isLoading}
        onClick={() => fileInputRef.current?.click()}
      >
        Agregar un archivo
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="application/pdf,image/*"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            uploadFile(file)
          }
          event.target.value = ''
        }}
      />
    </Stack>
  )
}

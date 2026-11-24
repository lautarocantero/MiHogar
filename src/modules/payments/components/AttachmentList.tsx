import { useRef } from 'react'
import { Alert, Button, Stack, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { AttachmentItem } from './AttachmentItem'
import { useAttachments } from '../hooks/useAttachments'
import type { AttachmentListProps } from '../typings/props'
import { useAppSelector } from '@/store/hooks'
import { selectIsDemoMode } from '@/store/vault/vaultSelectors'
import { useT } from '@/i18n'

export function AttachmentList({ payment }: AttachmentListProps): React.JSX.Element {
  const { uploadFile, openFile, removeFile, isLoading, errorMessage } = useAttachments(payment)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDemoMode = useAppSelector(selectIsDemoMode)
  const t = useT()

  return (
    <Stack spacing={2} aria-busy={isLoading}>
      <Typography variant="h6" component="h3">
        {t('attachments.title')}
      </Typography>
      {payment.attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('attachments.empty')}
        </Typography>
      ) : (
        <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {payment.attachments.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              attachment={attachment}
              onOpen={openFile}
              onRemove={removeFile}
              isBusy={isLoading}
            />
          ))}
        </Stack>
      )}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {isDemoMode ? (
        <Alert severity="info">{t('attachments.demoUnavailable')}</Alert>
      ) : (
        <>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
          >
            {isLoading ? t('attachments.working') : t('attachments.add')}
          </Button>
          <Typography variant="caption" color="text.secondary">
            {t('attachments.hint')}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="application/pdf,image/*"
            aria-label={t('attachments.add')}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                uploadFile(file)
              }
              event.target.value = ''
            }}
          />
        </>
      )}
    </Stack>
  )
}

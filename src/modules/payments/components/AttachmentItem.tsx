import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { formatFileSize } from '@/utils/formatting/formatFileSize'
import { useT } from '@/i18n'
import { AttachmentTypeIcon } from './AttachmentTypeIcon'
import type { AttachmentItemProps } from '../typings/props'

export function AttachmentItem({
  attachment,
  onOpen,
  onRemove,
  isBusy
}: AttachmentItemProps): React.JSX.Element {
  const t = useT()

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={{ xs: 1, sm: 2 }}
      component="li"
      sx={{ listStyle: 'none', minWidth: 0 }}
    >
      <AttachmentTypeIcon mimeType={attachment.mimeType} />
      <Box flexGrow={1} minWidth={0}>
        <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
          {attachment.fileName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatFileSize(attachment.sizeBytes)}
        </Typography>
      </Box>
      <Button
        size="small"
        variant="outlined"
        onClick={() => onOpen(attachment)}
        disabled={isBusy}
        aria-label={t('attachments.openNamed', { name: attachment.fileName })}
        sx={{ flexShrink: 0 }}
      >
        {t('attachments.open')}
      </Button>
      <IconButton
        aria-label={t('attachments.removeNamed', { name: attachment.fileName })}
        onClick={() => onRemove(attachment)}
        disabled={isBusy}
        sx={{ flexShrink: 0 }}
      >
        <DeleteOutlineIcon />
      </IconButton>
    </Stack>
  )
}

import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { formatFileSize } from '@/utils/formatting/formatFileSize'
import { AttachmentTypeIcon } from './AttachmentTypeIcon'
import type { AttachmentItemProps } from '../typings/props'

export function AttachmentItem({
  attachment,
  onOpen,
  onRemove
}: AttachmentItemProps): React.JSX.Element {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      component="li"
      sx={{ listStyle: 'none' }}
    >
      <AttachmentTypeIcon mimeType={attachment.mimeType} />
      <Box flexGrow={1}>
        <Typography variant="body1">{attachment.fileName}</Typography>
        <Typography variant="caption" color="text.secondary">
          {formatFileSize(attachment.sizeBytes)}
        </Typography>
      </Box>
      <Button size="small" variant="outlined" onClick={() => onOpen(attachment.relativePath)}>
        Abrir
      </Button>
      <IconButton
        aria-label={`Borrar ${attachment.fileName}`}
        onClick={() => onRemove(attachment.id, attachment.relativePath)}
      >
        <DeleteOutlineIcon />
      </IconButton>
    </Stack>
  )
}

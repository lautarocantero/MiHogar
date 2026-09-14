import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ImageIcon from '@mui/icons-material/Image'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import type { AttachmentTypeIconProps } from '../typings/props'

export function AttachmentTypeIcon({ mimeType }: AttachmentTypeIconProps): React.JSX.Element {
  if (mimeType === 'application/pdf') {
    return <PictureAsPdfIcon aria-hidden="true" />
  }
  if (mimeType.startsWith('image/')) {
    return <ImageIcon aria-hidden="true" />
  }
  return <InsertDriveFileIcon aria-hidden="true" />
}

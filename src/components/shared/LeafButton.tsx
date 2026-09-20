import { Button } from '@mui/material'
import type { ButtonProps } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import twigPattern from '@/assets/images/twig-pattern.png'

export function LeafButton({ sx, ...props }: ButtonProps): React.JSX.Element {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 0,
        backgroundColor: organicColors.brown.dark,
        '&:hover': { backgroundColor: organicColors.brown.main },
        '&.Mui-disabled': {
          backgroundColor: organicColors.brown.dark,
          opacity: 0.5,
          color: '#fffdf9'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: `url(${twigPattern})`,
          backgroundSize: 220,
          backgroundRepeat: 'repeat',
          filter: 'invert(1) grayscale(1) contrast(0.9)',
          mixBlendMode: 'screen',
          opacity: 0.22,
          pointerEvents: 'none'
        },
        ...sx
      }}
    />
  )
}

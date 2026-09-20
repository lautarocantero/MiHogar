import { Box, Card, IconButton, LinearProgress, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { getGoalIcon } from '../goalIcons'
import type { SavingsGoalRowProps } from '../typings/props'

export function SavingsGoalRow({ goal, onEdit, onDelete }: SavingsGoalRowProps): React.JSX.Element {
  const accent = goal.colorTag ?? organicColors.sage.main
  const Icon = getGoalIcon(goal.icon)

  return (
    <Card
      component="li"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        backgroundColor: organicColors.surface,
        border: `1px solid ${organicColors.neutral.border}`
      }}
      elevation={0}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          flexShrink: 0,
          backgroundColor: organicColors.orange.tint,
          color: accent
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box flex="1 1 240px" minWidth={0}>
        <Typography
          component="p"
          noWrap
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.0625rem',
            color: organicColors.orange.dark
          }}
        >
          {goal.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {goal.ownerLabel} · {goal.remainingLabel}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1.25} mt={0.75}>
          <LinearProgress
            variant="determinate"
            value={goal.percent}
            sx={{
              flex: 1,
              height: 8,
              backgroundColor: organicColors.neutral.border,
              '& .MuiLinearProgress-bar': { backgroundColor: accent }
            }}
          />
          <Typography variant="caption" fontWeight={600} color="text.secondary" whiteSpace="nowrap">
            {Math.round(goal.percent)}%
          </Typography>
        </Stack>
      </Box>
      <Stack alignItems="flex-end" spacing={0.25} flexShrink={0}>
        <Typography component="p" fontSize="0.875rem" whiteSpace="nowrap">
          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
        </Typography>
        <Typography variant="caption" color="text.secondary" whiteSpace="nowrap">
          Faltan {formatCurrency(goal.remainingAmount)}
        </Typography>
      </Stack>
      <IconButton aria-label={`Editar ${goal.name}`} onClick={() => onEdit(goal)} size="small">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label={`Eliminar ${goal.name}`} onClick={() => onDelete(goal)} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Card>
  )
}

import { useState } from 'react'
import { Box, Card, Chip, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { AccountType } from '@/typings/domain/enums'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { computeSingleCardAvailable } from '@/utils/domain/computeCreditCardAvailable'
import { resolveAccountTypeColor } from '@/utils/domain/resolveAccountTypeColor'
import type { AccountCardProps } from '../typings/props'

function OptionsMenu({
  onEdit,
  onDelete
}: Pick<AccountCardProps, 'onEdit' | 'onDelete'>): React.JSX.Element {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

  return (
    <>
      <IconButton
        size="small"
        aria-label="Opciones"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        sx={{ color: 'inherit' }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            onEdit()
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            onDelete()
          }}
        >
          Eliminar
        </MenuItem>
      </Menu>
    </>
  )
}

function shadeHexColor(hex: string, percent: number): string {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) return hex
  const num = parseInt(normalized, 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.round(255 * percent)))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(255 * percent)))
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(255 * percent)))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps): React.JSX.Element {
  const isCreditCard = account.type === AccountType.CREDIT_CARD

  if (isCreditCard) {
    const available = computeSingleCardAvailable(account)
    const baseColor = account.color ?? organicColors.blue.main
    const darkColor = shadeHexColor(baseColor, -0.22)

    return (
      <Card
        component="article"
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px !important',
          background: `linear-gradient(135deg, ${baseColor} 0%, ${darkColor} 100%)`,
          color: '#fffdf9',
          flexShrink: 0,
          cursor: 'pointer'
        }}
      >
        <Stack direction="row" alignItems="flex-start" gap={1.75}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.16)'
            }}
          >
            <AccountBalanceIcon />
          </Box>
          <Box flexGrow={1} minWidth={0}>
            <Typography sx={{ fontSize: '1.0625rem', fontWeight: 600 }} noWrap>
              {account.name}
            </Typography>
            <Chip
              label={account.ownerLabel}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: '#fffdf9',
                borderRadius: 999
              }}
            />
          </Box>
          <OptionsMenu onEdit={onEdit} onDelete={onDelete} />
        </Stack>

        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Typography sx={{ fontSize: '0.9375rem', letterSpacing: '2px', opacity: 0.92 }}>
            •••• •••• •••• ••••
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          gap={1.5}
          mt={2}
        >
          <Box minWidth={0}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Disponible
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              {formatCurrency(available)}
            </Typography>
          </Box>
          {(account.closingDay || account.dueDay) && (
            <Stack alignItems="flex-end" spacing={0.25}>
              {account.closingDay && (
                <Typography variant="caption" sx={{ opacity: 0.65, textAlign: 'right' }}>
                  Cierra el {account.closingDay}
                </Typography>
              )}
              {account.dueDay && (
                <Typography variant="caption" sx={{ opacity: 0.65, textAlign: 'right' }}>
                  Vence el {account.dueDay}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </Card>
    )
  }

  const typeColor = resolveAccountTypeColor(account.type)
  const accent = account.color ?? typeColor.main

  return (
    <Card
      component="article"
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2.25,
        backgroundColor: organicColors.surface,
        border: `1px solid ${organicColors.neutral.border}`,
        cursor: 'pointer'
      }}
    >
      <Box sx={{ alignSelf: 'stretch', width: 8, flexShrink: 0, backgroundColor: accent }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          flexShrink: 0,
          backgroundColor: typeColor.tint,
          color: accent
        }}
      >
        <AccountBalanceIcon fontSize="small" />
      </Box>
      <Box flexGrow={1} minWidth={0}>
        <Typography
          component="p"
          noWrap
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.0625rem',
            color: organicColors.orange.dark
          }}
        >
          {account.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {account.typeLabel}
        </Typography>
        <Chip
          label={account.ownerLabel}
          size="small"
          sx={{
            mt: 0.5,
            backgroundColor: typeColor.tint,
            color: organicColors.neutral.textSecondary
          }}
        />
        {account.contextPhrase && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ display: 'block', mt: 0.5 }}
          >
            {account.contextPhrase}
          </Typography>
        )}
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Saldo disponible
        </Typography>
        <Typography
          component="p"
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.375rem',
            whiteSpace: 'nowrap',
            color: organicColors.orange.dark
          }}
        >
          {formatCurrency(account.balance)}
        </Typography>
      </Box>
      <OptionsMenu onEdit={onEdit} onDelete={onDelete} />
    </Card>
  )
}

import { useEffect, useId } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unlockFormSchema } from '@/validation/unlockFormSchema'
import { useT } from '@/i18n'
import { DialogHeader } from './DialogHeader'
import { PasswordField } from './PasswordField'
import { LeafButton } from './LeafButton'

type HouseholdKeyPromptDialogProps = {
  open: boolean
  title: string
  description: string
  submitLabel: string
  isSubmitting: boolean
  errorMessage: string | null
  onSubmit: (householdKey: string) => void
  onClose: () => void
}

type FormValues = { householdKey: string }

/** Pide la clave del hogar de un respaldo antes de restaurarlo. */
export function HouseholdKeyPromptDialog({
  open,
  title,
  description,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
  onClose
}: HouseholdKeyPromptDialogProps): React.JSX.Element {
  const t = useT()
  const titleId = useId()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(unlockFormSchema),
    defaultValues: { householdKey: '' }
  })
  const { ref: householdKeyRef, ...householdKeyField } = register('householdKey')

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const handleClose = (): void => {
    if (!isSubmitting) onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" aria-labelledby={titleId}>
      <DialogHeader id={titleId} onClose={handleClose}>
        {title}
      </DialogHeader>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit((values) => onSubmit(values.householdKey))}
      >
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            <PasswordField
              label={t('onboarding.householdKeyLabel')}
              autoComplete="off"
              autoFocus
              fullWidth
              inputRef={householdKeyRef}
              {...householdKeyField}
              error={Boolean(errors.householdKey)}
              helperText={
                errors.householdKey ? t('onboarding.validation.householdKeyRequired') : ' '
              }
              slotProps={{ htmlInput: { 'aria-required': true } }}
            />
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <LeafButton type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? t('onboarding.restoring') : submitLabel}
          </LeafButton>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

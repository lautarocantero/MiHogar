import { Controller } from 'react-hook-form'
import { MenuItem, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { FormSectionHeader } from '@/components/shared/FormSectionHeader'
import { TaskSeverity } from '@/typings/domain/enums'
import { TaskCategoryPicker } from './TaskCategoryPicker'
import type { TaskFormFieldsProps } from '../typings/props'

const SEVERITY_LABEL: Record<TaskSeverity, string> = {
  [TaskSeverity.LOW]: 'Baja',
  [TaskSeverity.MEDIUM]: 'Media',
  [TaskSeverity.HIGH]: 'Alta',
  [TaskSeverity.CRITICAL]: 'Crítica'
}

export function TaskFormFields({
  register,
  control,
  errors
}: TaskFormFieldsProps): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <FormSectionHeader step={1} title="Qué es" subtitle="Título y descripción de la tarea" />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Título"
          placeholder="Ej: Arreglar el bug de las fechas de tarjeta"
          {...register('title')}
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Descripción (opcional)"
          multiline
          minRows={3}
          {...register('description')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="severity"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Severidad"
              select
              value={field.value}
              onChange={field.onChange}
            >
              {Object.values(TaskSeverity).map((severity) => (
                <MenuItem key={severity} value={severity}>
                  {SEVERITY_LABEL[severity]}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Fecha de inicio (opcional)"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('startDate')}
        />
      </Grid>
      <Grid size={12}>
        <Controller
          name="categoryIds"
          control={control}
          render={({ field }) => (
            <TaskCategoryPicker value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Fecha límite (opcional)"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('dueDate')}
          error={Boolean(errors.dueDate)}
          helperText={errors.dueDate?.message}
        />
      </Grid>
    </Grid>
  )
}

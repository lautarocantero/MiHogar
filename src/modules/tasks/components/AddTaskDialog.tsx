import { Alert, Box, Button, Dialog, DialogContent, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { addTaskFormSchema } from '@/validation/addTaskFormSchema'
import type { AddTaskFormValues } from '@/validation/addTaskFormSchema'
import { TaskSeverity } from '@/typings/domain/enums'
import { useCreateTask } from '../useCreateTask'
import { TaskFormFields } from './TaskFormFields'
import type { AddTaskDialogProps } from '../typings/props'

export function AddTaskDialog({ open, onClose }: AddTaskDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreateTask(onClose)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<AddTaskFormValues>({
    resolver: zodResolver(addTaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      severity: TaskSeverity.MEDIUM,
      categoryIds: [],
      startDate: '',
      dueDate: ''
    }
  })

  const onSubmit = (values: AddTaskFormValues): void => {
    submit(values)
    reset()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="add-task-title">
      <DialogHeader id="add-task-title" onClose={onClose}>
        Nueva tarea
      </DialogHeader>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <TaskFormFields register={register} control={control} errors={errors} />
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" size="large" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando…' : 'Agregar'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

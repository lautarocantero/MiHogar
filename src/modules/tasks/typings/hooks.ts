import type { AddTaskFormValues } from '@/validation/addTaskFormSchema'

export type UseCreateTaskResult = {
  submit: (values: AddTaskFormValues) => void
  createFromTitle: (title: string) => void
  isSubmitting: boolean
  errorMessage: string | null
}

import type { AddTaskFormValues } from '@/validation/addTaskFormSchema'
import type { TaskView } from '@/typings/domain/types'
import type { TaskStatusDefinition } from '@/utils/domain/taskStatuses'

export type TaskCardProps = {
  task: TaskView
  onOpen: (task: TaskView) => void
  onMoveWithKeyboard: (task: TaskView, direction: 1 | -1) => void
}

export type TaskColumnProps = {
  status: TaskStatusDefinition
  tasks: TaskView[]
  onOpenTask: (task: TaskView) => void
  onQuickAdd?: (title: string) => void
  onDropTask: (taskId: string, beforeId?: string, afterId?: string) => void
  onMoveWithKeyboard: (task: TaskView, direction: 1 | -1) => void
}

export type TaskBoardProps = {
  tasks: TaskView[]
  onOpenTask: (task: TaskView) => void
  onQuickAdd: (title: string) => void
  onMoveTask: (taskId: string, statusId: string, beforeId?: string, afterId?: string) => void
}

export type AddTaskDialogProps = {
  open: boolean
  onClose: () => void
}

export type TaskFormFieldsProps = {
  register: import('react-hook-form').UseFormRegister<AddTaskFormValues>
  control: import('react-hook-form').Control<AddTaskFormValues>
  errors: import('react-hook-form').FieldErrors<AddTaskFormValues>
}

export type TaskDetailDialogProps = {
  task: TaskView | null
  onClose: () => void
}

export type ArchivedTasksListProps = {
  tasks: TaskView[]
  onRestore: (task: TaskView) => void
}

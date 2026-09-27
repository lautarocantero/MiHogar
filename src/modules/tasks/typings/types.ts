import type { TaskView } from '@/typings/domain/types'

export type { TaskView }

export type UseTasksDataResult = {
  tasks: TaskView[]
  isLoading: boolean
}

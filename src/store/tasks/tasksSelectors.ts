import type { RootState } from '@/store'
import type { Task } from '@/typings/domain/types'
import { tasksSelectors } from './tasksSlice'

export const selectAllTasks = (state: RootState): Task[] => tasksSelectors.selectAll(state.tasks)

export const selectTaskById = (state: RootState, taskId: string): Task | undefined =>
  tasksSelectors.selectById(state.tasks, taskId)

export const selectNextTaskSeq = (state: RootState): number => state.tasks.nextSeq

import { useCallback } from 'react'
import { Stack } from '@mui/material'
import { TASK_STATUSES } from '@/utils/domain/taskStatuses'
import { TaskColumn } from './TaskColumn'
import type { TaskView } from '@/typings/domain/types'
import type { TaskBoardProps } from '../typings/props'

export function TaskBoard({
  tasks,
  onOpenTask,
  onQuickAdd,
  onMoveTask
}: TaskBoardProps): React.JSX.Element {
  const moveWithKeyboard = useCallback(
    (task: TaskView, direction: 1 | -1) => {
      const currentIndex = TASK_STATUSES.findIndex((status) => status.id === task.statusId)
      const nextStatus = TASK_STATUSES[currentIndex + direction]
      if (nextStatus) {
        onMoveTask(task.id, nextStatus.id)
      }
    },
    [onMoveTask]
  )

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ overflowX: 'auto', pb: 2, alignItems: 'flex-start' }}
    >
      {TASK_STATUSES.map((status) => (
        <TaskColumn
          key={status.id}
          status={status}
          tasks={tasks.filter((task) => task.statusId === status.id)}
          onOpenTask={onOpenTask}
          onQuickAdd={status.role === 'intake' ? onQuickAdd : undefined}
          onDropTask={(taskId, beforeId, afterId) =>
            onMoveTask(taskId, status.id, beforeId, afterId)
          }
          onMoveWithKeyboard={moveWithKeyboard}
        />
      ))}
    </Stack>
  )
}

import { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SyncIcon from '@mui/icons-material/Sync'
import LabelIcon from '@mui/icons-material/Label'
import { organicTypography } from '@/theme/tokens'
import { LeafButton } from '@/components/shared/LeafButton'
import { useTasksData } from './useTasksData'
import { useCreateTask } from './useCreateTask'
import { useMoveTask } from './useMoveTask'
import { useArchiveTask } from './useArchiveTask'
import { useSyncGithub } from './useSyncGithub'
import { TaskBoard } from './components/TaskBoard'
import { AddTaskDialog } from './components/AddTaskDialog'
import { TaskDetailDialog } from './components/TaskDetailDialog'
import { ArchivedTasksList } from './components/ArchivedTasksList'
import { ManageTaskCategoriesDialog } from './components/ManageTaskCategoriesDialog'
import type { TaskStatusId } from '@/typings/domain/enums'
import type { TaskView } from '@/typings/domain/types'

export function TasksPage(): React.JSX.Element {
  const { tasks } = useTasksData()
  const { createFromTitle } = useCreateTask(() => undefined)
  const moveTask = useMoveTask()
  const { restore } = useArchiveTask()
  const { sync, isSyncing } = useSyncGithub()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [openTask, setOpenTask] = useState<TaskView | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const activeTasks = tasks.filter((task) => !task.archivedAt)
  const archivedTasks = tasks.filter((task) => task.archivedAt)

  const openTaskLive = openTask ? (tasks.find((task) => task.id === openTask.id) ?? null) : null

  return (
    <Stack spacing={3} component="section" aria-label="Tareas">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Typography
          component="h1"
          sx={{ fontFamily: organicTypography.titleFontFamily, fontSize: '1.75rem' }}
        >
          Tareas
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          <Button variant="outlined" onClick={() => setShowArchived((value) => !value)}>
            {showArchived ? 'Ver tablero' : 'Archivadas'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<LabelIcon />}
            onClick={() => setIsCategoriesOpen(true)}
          >
            Categorías
          </Button>
          <Button variant="outlined" startIcon={<SyncIcon />} onClick={sync} disabled={isSyncing}>
            {isSyncing ? 'Sincronizando…' : 'Sincronizar GitHub'}
          </Button>
          <LeafButton startIcon={<AddIcon />} onClick={() => setIsAddOpen(true)}>
            Nueva tarea
          </LeafButton>
        </Stack>
      </Stack>

      {showArchived ? (
        <ArchivedTasksList tasks={archivedTasks} onRestore={restore} />
      ) : (
        <TaskBoard
          tasks={activeTasks}
          onOpenTask={setOpenTask}
          onQuickAdd={createFromTitle}
          onMoveTask={(taskId, statusId, beforeId, afterId) =>
            moveTask(taskId, statusId as TaskStatusId, beforeId, afterId)
          }
        />
      )}

      <AddTaskDialog open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <TaskDetailDialog task={openTaskLive} onClose={() => setOpenTask(null)} />
      <ManageTaskCategoriesDialog
        open={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
      />
    </Stack>
  )
}

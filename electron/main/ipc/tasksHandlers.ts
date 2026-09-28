import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import type { TasksFile } from '@shared/vaultEnvelope.types'
import { readTasksFile, writeTasksFile } from '../persistence/tasksStore'

export function registerTasksHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.TASKS_LOAD, () => {
    return readTasksFile()
  })

  ipcMain.handle(IPC_CHANNELS.TASKS_SAVE, (_event, tasksFile: TasksFile) => {
    return writeTasksFile(tasksFile)
  })
}

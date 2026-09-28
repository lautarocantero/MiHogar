export function loadTasksFile(): Promise<unknown> {
  return window.tasksStorageApi.load()
}

export function saveTasksFile(tasksJson: unknown): Promise<void> {
  return window.tasksStorageApi.save(tasksJson)
}

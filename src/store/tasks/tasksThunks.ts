import { createAsyncThunk } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { RootState, AppDispatch } from '@/store'
import { loadTasksFile, saveTasksFile } from '@/apis/tasksStorageApi'
import { getPreferences } from '@/apis/preferencesApi'
import { getIssue, getPull, listPulls, listReviews } from '@/apis/githubTasksApi'
import { tasksFileSchema } from '@/validation/tasksFileSchema'
import { TASK_GITHUB_REPOS, TASK_KEY_PREFIX } from '@/utils/domain/taskStatuses'
import { decideTaskTransition } from '@/utils/domain/decideTaskTransition'
import { deriveApproved } from '@/utils/domain/deriveApproved'
import type { Task, TaskLink } from '@/typings/domain/types'
import { hydrateTasks, applyGithubSync } from './tasksSlice'
import { tasksSelectors } from './tasksSlice'
import { hydrateTaskCategories } from '@/store/taskCategories/taskCategoriesSlice'
import { taskCategoriesSelectors } from '@/store/taskCategories/taskCategoriesSlice'

const thunkTypes = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>()

export type GithubSyncReport = {
  discovered: number
  refreshed: number
  unchanged: number
  moved: number
  errors: string[]
}

const KEY_RE = new RegExp(`\\b${TASK_KEY_PREFIX}-(\\d+)\\b`, 'i')

function isLinkSettled(link: TaskLink): boolean {
  return link.type === 'pr' && link.state === 'closed'
}

function deriveLinkState(pull: {
  state: 'open' | 'closed'
  draft?: boolean
  merged_at: string | null
}): TaskLink['state'] {
  if (pull.merged_at) {
    return 'merged'
  }
  if (pull.draft) {
    return 'draft'
  }
  return pull.state === 'open' ? 'open' : 'closed'
}

export const loadTasksThunk = thunkTypes('tasks/load', async (_: void, { dispatch }) => {
  const rawTasksFile = await loadTasksFile()
  const tasksFile = tasksFileSchema.parse(rawTasksFile)
  dispatch(hydrateTasks({ tasks: tasksFile.tasks, nextSeq: tasksFile.nextSeq }))
  dispatch(hydrateTaskCategories(tasksFile.categories))
})

export const saveTasksThunk = thunkTypes('tasks/save', async (_: void, { getState }) => {
  const state = getState()
  const tasksFile = tasksFileSchema.parse({
    version: 1,
    tasks: tasksSelectors.selectAll(state.tasks),
    categories: taskCategoriesSelectors.selectAll(state.taskCategories),
    nextSeq: state.tasks.nextSeq
  })
  await saveTasksFile(tasksFile)
})

export const syncGithubThunk = thunkTypes(
  'tasks/syncGithub',
  async (_: void, { getState, dispatch }): Promise<GithubSyncReport> => {
    const preferences = await getPreferences()
    const token = preferences.githubTasksToken
    if (!token) {
      throw new Error('Configurá el token de GitHub en Ajustes antes de sincronizar')
    }

    const report: GithubSyncReport = {
      discovered: 0,
      refreshed: 0,
      unchanged: 0,
      moved: 0,
      errors: []
    }
    const state = getState()
    const tasks = tasksSelectors.selectAll(state.tasks).filter((task) => !task.archivedAt)
    const tasksBySeq = new Map(tasks.map((task) => [task.seq, task]))
    const nextLinksByTaskId = new Map<string, TaskLink[]>(
      tasks.map((task) => [task.id, task.links])
    )

    for (const repo of TASK_GITHUB_REPOS) {
      let pulls
      try {
        pulls = await listPulls(repo, token)
      } catch (error) {
        report.errors.push(
          error instanceof Error ? error.message : `No se pudo listar PRs de ${repo}`
        )
        continue
      }
      for (const pull of pulls) {
        const match = KEY_RE.exec(pull.title) ?? KEY_RE.exec(pull.head.ref)
        if (!match) {
          continue
        }
        const task = tasksBySeq.get(Number(match[1]))
        if (!task) {
          continue
        }
        const links = nextLinksByTaskId.get(task.id) ?? []
        const alreadyLinked = links.some(
          (link) => link.repo === repo && link.number === pull.number
        )
        if (alreadyLinked) {
          continue
        }
        const newLink: TaskLink = {
          id: uuidv4(),
          repo: pull.base.repo.full_name,
          type: 'pr',
          number: pull.number,
          url: `https://github.com/${repo}/pull/${pull.number}`,
          title: pull.title,
          state: deriveLinkState(pull),
          mergedAt: pull.merged_at ?? undefined,
          mergeCommitSha: pull.merge_commit_sha ?? undefined,
          syncedAt: new Date().toISOString()
        }
        nextLinksByTaskId.set(task.id, [...links, newLink])
        report.discovered += 1
      }
    }

    const updatedTasks: Task[] = []

    for (const task of tasks) {
      const linksBefore = task.links
      const currentLinks = nextLinksByTaskId.get(task.id) ?? task.links
      const refreshedLinks: TaskLink[] = []

      for (const link of currentLinks) {
        if (isLinkSettled(link)) {
          refreshedLinks.push(link)
          report.unchanged += 1
          continue
        }

        try {
          if (link.type === 'issue') {
            const issueResult = await getIssue(link.repo, link.number, token, link.etag)
            if (issueResult.status === 'not_modified') {
              refreshedLinks.push({
                ...link,
                syncedAt: new Date().toISOString(),
                syncError: undefined
              })
              report.unchanged += 1
              continue
            }
            if (issueResult.status === 'error') {
              refreshedLinks.push({ ...link, syncError: issueResult.message })
              report.errors.push(issueResult.message)
              continue
            }
            if (issueResult.data.pull_request) {
              const pullResult = await getPull(link.repo, link.number, token)
              if (pullResult.status === 'ok') {
                refreshedLinks.push({
                  ...link,
                  type: 'pr',
                  state: deriveLinkState(pullResult.data),
                  mergedAt: pullResult.data.merged_at ?? undefined,
                  mergeCommitSha: pullResult.data.merge_commit_sha ?? undefined,
                  etag: pullResult.etag,
                  syncedAt: new Date().toISOString(),
                  syncError: undefined
                })
                report.refreshed += 1
                continue
              }
            }
            refreshedLinks.push({
              ...link,
              stateReason: issueResult.data.state_reason ?? undefined,
              state: issueResult.data.state === 'closed' ? 'closed' : 'open',
              etag: issueResult.etag,
              syncedAt: new Date().toISOString(),
              syncError: undefined
            })
            report.refreshed += 1
            continue
          }

          const pullResult = await getPull(link.repo, link.number, token, link.etag)
          if (pullResult.status === 'not_modified') {
            refreshedLinks.push({
              ...link,
              syncedAt: new Date().toISOString(),
              syncError: undefined
            })
            report.unchanged += 1
            continue
          }
          if (pullResult.status === 'error') {
            refreshedLinks.push({ ...link, syncError: pullResult.message })
            report.errors.push(pullResult.message)
            continue
          }

          let approved = link.approved
          try {
            const reviews = await listReviews(link.repo, link.number, token)
            approved = deriveApproved(reviews)
          } catch {
            // se conserva el approved anterior — perder el dato es peor que tenerlo viejo
          }

          refreshedLinks.push({
            ...link,
            state: deriveLinkState(pullResult.data),
            mergedAt: pullResult.data.merged_at ?? undefined,
            mergeCommitSha: pullResult.data.merge_commit_sha ?? undefined,
            approved,
            etag: pullResult.etag,
            syncedAt: new Date().toISOString(),
            syncError: undefined
          })
          report.refreshed += 1
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error de sync desconocido'
          refreshedLinks.push({ ...link, syncError: message })
          report.errors.push(message)
        }
      }

      const nextStatusId = decideTaskTransition(task.statusId, linksBefore, refreshedLinks)
      const changed =
        JSON.stringify(linksBefore) !== JSON.stringify(refreshedLinks) || nextStatusId !== null

      if (changed) {
        if (nextStatusId) {
          report.moved += 1
        }
        updatedTasks.push({
          ...task,
          links: refreshedLinks,
          statusId: nextStatusId ?? task.statusId,
          updatedAt: new Date().toISOString(),
          updatedBy: 'github'
        })
      }
    }

    if (updatedTasks.length > 0) {
      dispatch(applyGithubSync(updatedTasks))
    }

    return report
  }
)

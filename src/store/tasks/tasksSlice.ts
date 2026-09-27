import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Task } from '@/typings/domain/types'

const tasksAdapter = createEntityAdapter<Task>()

const initialState = tasksAdapter.getInitialState({ nextSeq: 0 })

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    hydrateTasks: (state, action: PayloadAction<{ tasks: Task[]; nextSeq: number }>) => {
      tasksAdapter.setAll(state, action.payload.tasks)
      state.nextSeq = action.payload.nextSeq
    },
    addTask: {
      reducer: (state, action: PayloadAction<Task>) => {
        tasksAdapter.addOne(state, action.payload)
        state.nextSeq = Math.max(state.nextSeq, action.payload.seq) + 1
      },
      prepare: (task: Omit<Task, 'seq'>, nextSeq: number) => ({
        payload: { ...task, seq: nextSeq } as Task
      })
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      tasksAdapter.upsertOne(state, action.payload)
    },
    removeTask: tasksAdapter.removeOne,
    applyGithubSync: (state, action: PayloadAction<Task[]>) => {
      tasksAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { hydrateTasks, addTask, updateTask, removeTask, applyGithubSync } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const tasksSelectors = tasksAdapter.getSelectors()

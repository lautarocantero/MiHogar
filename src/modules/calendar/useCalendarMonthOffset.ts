import { useState } from 'react'

const STORAGE_KEY = 'miHogar.calendar.monthOffset'
const MIN_OFFSET = -6
const MAX_OFFSET = 6

function clamp(value: number): number {
  return Math.min(MAX_OFFSET, Math.max(MIN_OFFSET, value))
}

function readStoredOffset(): number {
  const raw = Number(localStorage.getItem(STORAGE_KEY))
  return Number.isFinite(raw) ? clamp(raw) : 0
}

export type UseCalendarMonthOffsetResult = {
  offset: number
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  canGoPrev: boolean
  canGoNext: boolean
}

export function useCalendarMonthOffset(): UseCalendarMonthOffsetResult {
  const [offset, setOffset] = useState<number>(readStoredOffset)

  const updateOffset = (next: number): void => {
    const clamped = clamp(next)
    setOffset(clamped)
    localStorage.setItem(STORAGE_KEY, String(clamped))
  }

  return {
    offset,
    goToPreviousMonth: () => updateOffset(offset - 1),
    goToNextMonth: () => updateOffset(offset + 1),
    canGoPrev: offset > MIN_OFFSET,
    canGoNext: offset < MAX_OFFSET
  }
}

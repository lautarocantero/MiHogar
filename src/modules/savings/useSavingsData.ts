import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectAllSavingsInstruments, selectTotalSaved } from '@/store/savings/savingsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { selectAllSavingsGoals } from '@/store/savingsGoals/savingsGoalsSelectors'
import { selectAllSavingsSnapshotsSortedByMonth } from '@/store/savingsSnapshots/savingsSnapshotsSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolveSavingsConditionText } from '@/utils/domain/resolveSavingsConditionText'
import { resolveGoalRemainingLabel } from '@/utils/domain/resolveGoalRemainingLabel'
import { computeNextMaturityDate } from '@/utils/domain/computeNextMaturityDate'
import type { SavingsData, MonthSummaryItem } from './typings/types'

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function computeDeltaPercent(current: number, previous: number): number | null {
  if (previous <= 0) {
    return null
  }
  return ((current - previous) / previous) * 100
}

export function useSavingsData(): SavingsData {
  const instruments = useAppSelector(selectAllSavingsInstruments)
  const totalSaved = useAppSelector(selectTotalSaved)
  const members = useAppSelector(selectAllMembers)
  const goals = useAppSelector(selectAllSavingsGoals)
  const snapshots = useAppSelector(selectAllSavingsSnapshotsSortedByMonth)

  return useMemo(() => {
    const instrumentViews = instruments.map((instrument) => ({
      ...instrument,
      ownerLabel: resolveOwnerLabel(instrument.ownerType, instrument.ownerId, members),
      conditionText: resolveSavingsConditionText(instrument),
      monthlyDeltaPercent: instrument.rateAnnual ? instrument.rateAnnual / 12 : null
    }))

    const isInvestment = (instrument: (typeof instrumentViews)[number]): boolean =>
      Boolean(instrument.rateAnnual) && !instrument.liquidAnytime

    const monthlyInterestTotal = instruments.reduce(
      (total, instrument) => total + (instrument.monthlyInterestEstimate ?? 0),
      0
    )
    const totalInvested = instrumentViews
      .filter(isInvestment)
      .reduce((total, instrument) => total + instrument.principal, 0)

    const nextMaturityDate = computeNextMaturityDate(instruments)

    const goalViews = goals.map((goal) => {
      const percent =
        goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0
      return {
        ...goal,
        ownerLabel: resolveOwnerLabel(goal.ownerType, goal.ownerId, members),
        percent,
        remainingAmount: Math.max(goal.targetAmount - goal.currentAmount, 0),
        remainingLabel: resolveGoalRemainingLabel(goal.targetDate) ?? 'Sin fecha límite'
      }
    })

    const evolution = snapshots.map((snapshot) => ({
      monthKey: snapshot.monthKey,
      label: capitalize(format(parseISO(`${snapshot.monthKey}-01`), 'MMM', { locale: es })),
      savings: snapshot.totalSaved,
      investments: snapshot.totalInvested,
      total: snapshot.totalSaved + snapshot.totalInvested
    }))

    const lastSnapshot = snapshots[snapshots.length - 1]
    const previousSnapshot = snapshots[snapshots.length - 2]
    const aportesAhorros = lastSnapshot
      ? Math.max(lastSnapshot.totalSaved - (previousSnapshot?.totalSaved ?? 0), 0)
      : 0
    const aportesInversiones = lastSnapshot
      ? Math.max(lastSnapshot.totalInvested - (previousSnapshot?.totalInvested ?? 0), 0)
      : 0

    const monthSummary: MonthSummaryItem[] = [
      {
        key: 'aportes-ahorros',
        label: 'Aportes a ahorros',
        icon: 'savings',
        amount: aportesAhorros,
        deltaPercent: previousSnapshot
          ? computeDeltaPercent(lastSnapshot?.totalSaved ?? 0, previousSnapshot.totalSaved)
          : null
      },
      {
        key: 'aportes-inversiones',
        label: 'Aportes a inversiones',
        icon: 'account_balance',
        amount: aportesInversiones,
        deltaPercent: previousSnapshot
          ? computeDeltaPercent(lastSnapshot?.totalInvested ?? 0, previousSnapshot.totalInvested)
          : null
      },
      {
        key: 'rendimiento-inversiones',
        label: 'Rendimiento de inversiones',
        icon: 'eco',
        amount: monthlyInterestTotal,
        deltaPercent: null
      }
    ]

    return {
      summary: {
        totalSaved,
        monthlyInterestTotal,
        totalInvested,
        nextMaturityLabel: nextMaturityDate
          ? format(parseISO(nextMaturityDate), "d 'de' MMM", { locale: es })
          : null
      },
      savingsInstruments: instrumentViews.filter((instrument) => !isInvestment(instrument)),
      investmentInstruments: instrumentViews.filter(isInvestment),
      goals: goalViews,
      evolution,
      monthSummary
    }
  }, [instruments, totalSaved, members, goals, snapshots])
}

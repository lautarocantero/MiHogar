import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import {
  selectAllDebts,
  selectTotalOwedByHousehold,
  selectTotalOwedToHousehold
} from '@/store/debts/debtsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolveDebtConditionText } from '@/utils/domain/resolveDebtConditionText'
import { DebtDirection } from '@/typings/domain/enums'
import type { Debt } from '@/typings/domain/types'
import type { HouseholdMember } from '@/typings/domain/types'
import type { DebtsData, DebtView } from './typings/types'

function computeProgressPercent(debt: Debt): number | null {
  if (debt.installmentsTotal) {
    return Math.min(((debt.installmentsPaid ?? 0) / debt.installmentsTotal) * 100, 100)
  }
  if (debt.principal > 0) {
    return Math.min(((debt.principal - debt.outstandingBalance) / debt.principal) * 100, 100)
  }
  return null
}

function toDebtView(debt: Debt, members: HouseholdMember[]): DebtView {
  return {
    ...debt,
    ownerLabel: resolveOwnerLabel(debt.ownerType, debt.ownerId, members),
    conditionText: resolveDebtConditionText(debt),
    progressPercent: computeProgressPercent(debt)
  }
}

export function useDebtsData(): DebtsData {
  const debts = useAppSelector(selectAllDebts)
  const totalOwedByHousehold = useAppSelector(selectTotalOwedByHousehold)
  const totalOwedToHousehold = useAppSelector(selectTotalOwedToHousehold)
  const members = useAppSelector(selectAllMembers)

  return useMemo(() => {
    const views = debts.map((debt) => toDebtView(debt, members))

    return {
      summary: { totalOwedByHousehold, totalOwedToHousehold },
      owedByHousehold: views.filter((debt) => debt.direction === DebtDirection.OWED_BY_HOUSEHOLD),
      owedToHousehold: views.filter((debt) => debt.direction === DebtDirection.OWED_TO_HOUSEHOLD)
    }
  }, [debts, members, totalOwedByHousehold, totalOwedToHousehold])
}

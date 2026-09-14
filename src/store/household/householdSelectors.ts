import type { RootState } from '@/store'
import type { HouseholdMember } from '@/typings/domain/types'
import { membersSelectors } from './membersSlice'

export const selectHouseholdName = (state: RootState): string => state.household.name

export const selectAllMembers = (state: RootState): HouseholdMember[] =>
  membersSelectors.selectAll(state.members)

export const selectMemberById = (state: RootState, memberId: string): HouseholdMember | undefined =>
  membersSelectors.selectById(state.members, memberId)

import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateMovementThunk } from '@/store/movements/movementThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { MovementType } from '@/typings/domain/enums'
import type { Movement } from '@/typings/domain/types'
import type { QuickAddFormValues } from '@/modules/quickAdd/typings/types'
import type { UseUpdateMovementResult } from './typings/types'

export function useUpdateMovement(
  movement: Movement,
  onUpdated: () => void
): UseUpdateMovementResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: QuickAddFormValues) => {
      run(async () => {
        await dispatch(
          updateMovementThunk({
            id: movement.id,
            changes: {
              type: values.type,
              amount: values.amount,
              date: values.date,
              accountId: values.accountId,
              toAccountId: values.type === MovementType.TRANSFER ? values.toAccountId : undefined,
              categoryId: values.type === MovementType.TRANSFER ? undefined : values.categoryId,
              ownerType: movement.ownerType,
              ownerId: movement.ownerId,
              paymentId: movement.paymentId,
              note: values.note
            }
          })
        ).unwrap()
        onUpdated()
      }, 'No se pudo guardar el movimiento')
    },
    [dispatch, run, movement, onUpdated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

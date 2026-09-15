import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { removeMovementThunk } from '@/store/movements/movementThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import type { Movement } from '@/typings/domain/types'
import type { UseDeleteMovementResult } from './typings/types'

export function useDeleteMovement(
  movement: Movement,
  onDeleted: () => void
): UseDeleteMovementResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(() => {
    run(async () => {
      await dispatch(removeMovementThunk(movement.id)).unwrap()
      onDeleted()
    }, 'No se pudo eliminar el movimiento')
  }, [dispatch, run, movement, onDeleted])

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

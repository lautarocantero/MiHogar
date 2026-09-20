import { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { recordMovementThunk } from '@/store/movements/movementThunks'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { MovementType, OwnerType } from '@/typings/domain/enums'
import { QuickAddStep } from './typings/enums'
import type { QuickAddFormValues, UseQuickAddFormResult } from './typings/types'

const DONE_MESSAGE: Record<MovementType, string> = {
  [MovementType.EXPENSE]: 'Compra agregada',
  [MovementType.INCOME]: 'Dinero agregado',
  [MovementType.TRANSFER]: 'Dinero movido',
  [MovementType.CARD_PAYMENT]: 'Pago de tarjeta registrado'
}

export function useQuickAddForm(onDone: () => void): UseQuickAddFormResult {
  const dispatch = useAppDispatch()
  const [step, setStep] = useState(QuickAddStep.CHOOSE_TYPE)
  const [selectedType, setSelectedType] = useState<MovementType | null>(null)
  const { isLoading, error, run } = useLoader()
  const accounts = useAppSelector(selectAllAccounts)

  const chooseType = useCallback((type: MovementType) => {
    setSelectedType(type)
    setStep(
      type === MovementType.TRANSFER || type === MovementType.CARD_PAYMENT
        ? QuickAddStep.AMOUNT_AND_DETAILS
        : QuickAddStep.CHOOSE_FREQUENCY
    )
  }, [])

  const chooseOneOff = useCallback(() => {
    setStep(QuickAddStep.AMOUNT_AND_DETAILS)
  }, [])

  const chooseRecurring = useCallback(() => {
    setStep(QuickAddStep.RECURRING_DETAILS)
  }, [])

  const goBack = useCallback(() => {
    setStep((currentStep) => {
      if (currentStep === QuickAddStep.CHOOSE_FREQUENCY) {
        return QuickAddStep.CHOOSE_TYPE
      }
      if (selectedType === MovementType.TRANSFER || selectedType === MovementType.CARD_PAYMENT) {
        return QuickAddStep.CHOOSE_TYPE
      }
      return QuickAddStep.CHOOSE_FREQUENCY
    })
  }, [selectedType])

  const submit = useCallback(
    (entries: QuickAddFormValues[]) => {
      run(async () => {
        for (const values of entries) {
          const account = accounts.find((candidate) => candidate.id === values.accountId)
          const hasSecondaryAccount =
            values.type === MovementType.TRANSFER || values.type === MovementType.CARD_PAYMENT
          await dispatch(
            recordMovementThunk({
              type: values.type,
              amount: values.amount,
              currency: values.currency,
              date: values.date,
              accountId: values.accountId,
              toAccountId: hasSecondaryAccount ? values.toAccountId : undefined,
              categoryId: hasSecondaryAccount ? undefined : values.categoryId,
              ownerType: account?.ownerType ?? OwnerType.HOUSEHOLD,
              ownerId: account?.ownerId,
              note: values.note
            })
          ).unwrap()
        }
        const firstType = entries[0]?.type ?? selectedType
        dispatch(showToast(firstType ? DONE_MESSAGE[firstType] : 'Movimiento guardado'))
        onDone()
      }, 'No se pudo guardar el movimiento')
    },
    [dispatch, run, onDone, accounts, selectedType]
  )

  return {
    step,
    selectedType,
    chooseType,
    chooseOneOff,
    chooseRecurring,
    goBack,
    submit,
    isSubmitting: isLoading,
    errorMessage: error
  }
}

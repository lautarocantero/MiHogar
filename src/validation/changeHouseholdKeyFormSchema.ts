import * as yup from 'yup'

export const changeHouseholdKeyFormSchema = yup.object({
  currentKey: yup.string().required('validation.currentKeyRequired'),
  newKey: yup
    .string()
    .required('validation.newKeyRequired')
    .min(8, 'validation.keyTooShort'),
  confirmNewKey: yup
    .string()
    .required('validation.confirmKeyRequired')
    .oneOf([yup.ref('newKey')], 'validation.keysDontMatch')
})

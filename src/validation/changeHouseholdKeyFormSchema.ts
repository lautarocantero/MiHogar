import * as yup from 'yup'

export const changeHouseholdKeyFormSchema = yup.object({
  currentKey: yup.string().required('Ingresá la clave actual'),
  newKey: yup
    .string()
    .required('Ingresá la clave nueva')
    .min(8, 'La clave debe tener al menos 8 caracteres'),
  confirmNewKey: yup
    .string()
    .required('Repetí la clave nueva')
    .oneOf([yup.ref('newKey')], 'Las claves no coinciden')
})

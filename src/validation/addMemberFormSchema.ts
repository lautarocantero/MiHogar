import * as yup from 'yup'

export const addMemberFormSchema = yup.object({
  name: yup.string().required('Ingresá un nombre')
})

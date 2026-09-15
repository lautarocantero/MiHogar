import { useState } from 'react'
import { Divider, MenuItem, TextField } from '@mui/material'
import { useAppSelector } from '@/store/hooks'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { AddMemberDialog } from '@/modules/settings/components/AddMemberDialog'
import type { MemberOwnerFieldProps } from './typings/props'

const ADD_NEW_MEMBER_VALUE = '__add_member__'

export function MemberOwnerField({
  value,
  onChange,
  error,
  helperText,
  label = 'Integrante'
}: MemberOwnerFieldProps): React.JSX.Element {
  const members = useAppSelector(selectAllMembers)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  return (
    <>
      <TextField
        label={label}
        select
        value={value}
        onChange={(event) => {
          if (event.target.value === ADD_NEW_MEMBER_VALUE) {
            setIsAddMemberOpen(true)
            return
          }
          onChange(event.target.value)
        }}
        error={error}
        helperText={helperText}
      >
        {members.map((member) => (
          <MenuItem key={member.id} value={member.id}>
            {member.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem value={ADD_NEW_MEMBER_VALUE}>+ Agregar integrante</MenuItem>
      </TextField>
      <AddMemberDialog
        open={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onCreated={(memberId) => {
          onChange(memberId)
          setIsAddMemberOpen(false)
        }}
      />
    </>
  )
}

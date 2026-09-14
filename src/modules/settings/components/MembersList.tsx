import { useState } from 'react'
import { Avatar, Box, Button, Card, Stack, Typography } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAppSelector } from '@/store/hooks'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { organicColors } from '@/theme/tokens'
import { AddMemberDialog } from './AddMemberDialog'

export function MembersList(): React.JSX.Element {
  const members = useAppSelector(selectAllMembers)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            Quiénes usan la app
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => setIsAddMemberOpen(true)}
          >
            Agregar
          </Button>
        </Stack>

        {members.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Todavía no agregaste a nadie.
          </Typography>
        ) : (
          <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {members.map((member) => (
              <Stack key={member.id} component="li" direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{ bgcolor: organicColors.orange.tint, color: organicColors.orange.dark }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1">{member.name}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
      <AddMemberDialog open={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
    </Card>
  )
}

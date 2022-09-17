// ** MUI Imports
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'


// ** Icons Imports

import AccountGroup from 'mdi-material-ui/AccountGroup'

const Feature2 = () => {
  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
        }}
      >
        <Avatar
          sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
        >
          <AccountGroup sx={{ fontSize: '2rem' }} />
        </Avatar>
        <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
          Instant Rewards
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 6 }}>
        Humans are social animals,We improve completion rate by social learning, People change by observing others
        </Typography>
        <Button variant='outlined' sx={{ padding: theme => theme.spacing(1.75, 5.5) }}>
          Learn More
        </Button>
      </CardContent>
    </Card>
  )
}

export default Feature2

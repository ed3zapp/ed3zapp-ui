// ** MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const Journey = () => {
  return (
    <Card>
      
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Life of a Ed3Zapp Learner
        </Typography>
        <Typography variant='body2'>
          Let us look at how a typicall learner journey will look like using Ed3Zapp platfrom.
        </Typography>
      </CardContent>
      <CardMedia sx={{ height: '16.5625rem' }} image='/images/journey1.png' />
    </Card>
  )
}

export default Journey

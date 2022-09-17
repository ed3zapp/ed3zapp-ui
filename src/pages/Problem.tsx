// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'

   // ** logo
   const Img = styled('img')(({ }) => ({
  
}))


const Problem = () => {
  return (
    <Card>
      <Grid container spacing={6}>
      <Grid
          item
          sm={5}
          xs={12}
          sx={{ paddingTop: ['0 !important', '1.5rem !important'], paddingRight: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent

          >
            <Box>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingButtom:'4' }}>
              <Img  alt='Ed3Zpp Logo' src='/images/misc/pic2.png' />
              </Box>
             
            </Box>
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={7}>
          <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>

            <Typography variant='h6'>
            Preamble
            </Typography>
            <Divider sx={{ marginTop: 6.5, marginBottom: 6.75 }} />
            <Typography variant='body1'>
            To reskill and upskill the learning community across.<br/>
            </Typography>
        
            <Typography variant='body2'>
            COVID has changed learning forever. There is a paradigm shift in the way people learnt pre and post COVID, there is high growth and adoption in Education Technology. <br/><br/>We are experiencing an unplanned and rapid migration to online learning. A huge number of people started joining online courses to reskill and upskill.
            It is clear that this pandemic has utterly disrupted the way we learn. It had both positive and negative impacts. There was a terrible disconnect between the enrollment rate and completion rate which questioned the impact of online learning.
            </Typography>
            <Divider sx={{ marginTop: 6.5, marginBottom: 6.75 }} />
            <Typography variant='h6'>
            Problem
            </Typography>
            <Divider sx={{ marginTop: 6.5, marginBottom: 6.75 }} />
            <Typography variant='body2'>
            Learner's drop out rate is up by 67 % with most of them leaving due to a lack of Motivation and engaging content. We need to fix this problem by focusing on ways to Motivate the users ,Personalise and Reward their learning journey.
            </Typography>
        
            
    
            
          </CardContent>
        </Grid>
        
      </Grid>
    </Card>
  )
}

export default Problem

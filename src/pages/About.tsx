// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import Wallet from 'mdi-material-ui/Wallet'



const Login = dynamic(() => import("./TestLogin"), {
    ssr: false,
  });

  const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
      borderRight: ``
    }
  }))


   // ** logo
   const Img = styled('img')(({ }) => ({
  
}))

const About = () => {
  return (
    <Card>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={7}>
          <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
            <Typography variant='h3' sx={{ marginBottom: 3.5 }}>
             Ed3Zapp
            </Typography>
            <Typography variant='h6'>
            Enables content creator to influence learners behaviour
            </Typography>
            <Typography variant='body1'>
            Incentivizing learners and content creators
            </Typography>
           
            <Divider sx={{ marginTop: 6.5, marginBottom: 6.75 }} />
           
            <Typography variant='body2'>
            We created a dApp that can connect Sponsor and Learner together to achieve learning goals, that can create business impact for the organization. Sponsor can signup, onboard learners, create courses, assign reward for courses. Learner can learn the courses, take assessment, receive proof of milestone NFTS and earn rewards in USDCx super token. Learner can unwrap the token to stable coin and withdraw to their exchange account.
            </Typography>
          
              <Divider sx={{ marginTop: 6.5, marginBottom: 6.75 }} />
            <Grid container spacing={4}>
              <Grid item xs={12} sm={5}>
                <StyledBox>
                  <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                    <Login/>
                  </Box>
                </StyledBox>
              </Grid>
              <Grid item xs={12} sm={7}>
              <Button variant="contained" startIcon={<Wallet/>}>Connect Sequence</Button>
                
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
        <Grid
          item
          sm={5}
          xs={12}
          sx={{ paddingTop: ['0 !important', '1.5rem !important'], paddingLeft: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent

          >
            <Box>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingButtom:'4' }}>
              <Img  alt='Ed3Zapp Logo' src='/images/misc/zappic1.png' />
              </Box>
             
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default About

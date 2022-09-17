// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import dynamic from "next/dynamic";

const Login = dynamic(() => import("./TestLogin"), {
    ssr: false,
  });

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: ``
  }
}))

const About = () => {

  return (
    <Card>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={7}>
          <CardContent>
            <Typography variant='h3' sx={{ marginBottom: 3.5 }}>
              Ed3Zapp Home Page
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
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default About

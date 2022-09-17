// ** React Imports
import { Box, CardContent, Grid,  } from '@mui/material'

import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import VerticalNavHeader from 'src/@core/layouts/components/vertical/navigation/VerticalNavHeader'
import About from 'src/pages/About'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

// ** Demo Imports
import Feature1 from './Feature1'
import Feature2 from './Feature2'
import Feature3 from './Feature3'
import Footer1 from './Footer1'
import Journey from './Journey'
import Problem from './Problem'


interface Props {
  hidden: boolean
  navWidth: number
  settings: Settings
  children: ReactNode
  navVisible: boolean
  toggleNavVisibility: () => void
  setNavVisible: (value: boolean) => void
  verticalNavItems?: VerticalNavItemsType
  saveSettings: (values: Settings) => void
  verticalNavMenuContent?: (props?: any) => ReactNode
  afterVerticalNavMenuContent?: (props?: any) => ReactNode
  beforeVerticalNavMenuContent?: (props?: any) => ReactNode
}

const App = (props: Props) => {
  // ** Props
  const {
  } = props
  
  return (
   
      <>
      <Box className ='content-center' {...props}>
        <Grid container spacing={6}>
        <Grid item xs={12}>
          <VerticalNavHeader {...props}/>
        </Grid>
        
        <Grid item><About/></Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Feature1 />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Feature2 />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Feature3 />
        </Grid>

        <Grid item><Problem/></Grid>
        </Grid>
      </Box>
      <CardContent><Journey/><Footer1/></CardContent>
      </>
  )
}

App.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default App

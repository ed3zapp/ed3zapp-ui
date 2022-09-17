// ** React Imports
import { Box, Grid,  } from '@mui/material'

import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import VerticalNavHeader from 'src/@core/layouts/components/vertical/navigation/VerticalNavHeader'
import About from 'src/pages/About'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { VerticalNavItemsType } from 'src/@core/layouts/types'


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
      <Box {...props}>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <VerticalNavHeader {...props}/>
            <About/>
          </Grid>
        </Grid>
      </Box>
      </>
  )
}

App.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default App

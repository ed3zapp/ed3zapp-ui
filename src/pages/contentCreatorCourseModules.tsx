// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CourseModulesTable from 'src/views/tables/CourseModulesTable'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

interface IProps {
  courseId: number;
}

const ContentCreatorCourseModules: React.FC<IProps> = ({ courseId }) => {

  return (
    <ApexChartWrapper>
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>Course Modules</Typography>
            </Grid>
            <Grid item xs={12} sx={{ paddingBottom: 2, paddingTop: 2 }}>
                <Divider
                    textAlign='left'
                    sx={{
                    m: 0,
                    width: '100%',
                    lineHeight: 'normal',
                    textTransform: 'uppercase',
                    '&:before, &:after': { top: 7, transform: 'none' },
                    '& .MuiDivider-wrapper': { px: 2.5, fontSize: '0.75rem', letterSpacing: '0.21px' }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', 
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between' }}>
                <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Course</InputLabel>
                    <Select label='Country' defaultValue='USA'>
                      <MenuItem value='USA'>USA</MenuItem>
                      <MenuItem value='UK'>UK</MenuItem>
                      <MenuItem value='Australia'>Australia</MenuItem>
                      <MenuItem value='Germany'>Germany</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Button variant='contained' sx={{ marginRight: 3.5 }}>
                  Save Changes
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CourseModulesTable courseId={courseId} />
                </Card>
            </Grid>
        </Grid>
    </ApexChartWrapper>
  )
}

export default ContentCreatorCourseModules

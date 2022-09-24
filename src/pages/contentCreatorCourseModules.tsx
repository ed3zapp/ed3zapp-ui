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
import { useEffect, useState } from 'react'
import { useStore, UserType } from 'src/services/store'
import { useTableland } from "../services/hooks/useTableland"

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// move all of this to courseModeulesTable
const ContentCreatorCourseModules: React.FC = () => {
  const {
    state: { provider, wallet },
  } = useStore();

  const { getContentCreatorId, getUserType, getContentCreatorCourses } = useTableland();
  const [userType, setUserType] = useState(0);
  const [isContentCreator, setIsContentCreator] = useState(false);
  const [contentCreatorId, setContentCreatorId] = useState(0);
  const [courses, setCourses] = useState({ columns: [], rows: [] });
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [courseId, setCourseId] = useState(0);

  const fetchCourses = async () => {
    let startTime = Math.floor(Date.now());
    let endTime = Math.floor(Date.now());
    let userTypeVar = userType;

    // check type of user 
    if (userType == 0) {
      startTime = Math.floor(Date.now());
      userTypeVar = await getUserType(provider, wallet);
      endTime = Math.floor(Date.now());
      console.log("ContentCreatorCourseModules: Time to get user type: " + (endTime - startTime));
      setUserType(userTypeVar)
    }

    let isUserCC = false;
    if (userTypeVar == UserType.CONTENT_CREATOR) {
      setIsContentCreator(true);
      isUserCC = true;
    } 

    if (isUserCC) {

      // Get content creator id
      startTime = Math.floor(Date.now());
      const tb_contentCreatorId = await getContentCreatorId(provider, wallet);
      console.log("ContentCreatorCourseModules: Content creator ID: " + tb_contentCreatorId)
      endTime = Math.floor(Date.now());
      console.log("ContentCreatorCourseModules: Time to get content creator ID: " + (endTime - startTime));
      setContentCreatorId(tb_contentCreatorId);

      startTime = Math.floor(Date.now());
      const newCourses = await getContentCreatorCourses(provider, tb_contentCreatorId);
      endTime = Math.floor(Date.now());
      console.log("ContentCreatorCourseModules: Time to get content creator courses: " + (endTime - startTime));

      const x = newCourses !== null ? newCourses.rows.length : 0;
      console.log("ContentCreatorCourseModules: Set courses: " +  x);
      setCourses(newCourses);
    }
  }

  //To fetch courses onload
  useEffect(() => {
    if (!provider) {
      return;
    }

    fetchCourses();
  }, [provider]);

  const showModules = async() => {
    setCourseId(selectedCourse);
    console.log("ContentCreatorCourseModules: Selected course ID: " + selectedCourse)
    setShowTable(true);
  };

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
            <Grid item xs={12} >
              <Box sx={{ display: 'flex', 
                          flexWrap: 'wrap',
                          alignItems: 'center'}}>
                <Box sx={{ mr: 2, mb: 1, width: 600, display: 'flex', flexDirection: 'column' }}>
                  <FormControl fullWidth>
                    <InputLabel variant="outlined">Select Course</InputLabel>
                    <Select label='Courses' onChange={(value) => setSelectedCourse(value.target.value as number)}>
                      {courses !== null && courses.rows.map((data) => {
                        return ((data[0] != -1) && 
                          <MenuItem value={data[0]}>{data[2]}</MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                </Box>
                <Button variant='contained' onClick={() => showModules()}>
                  Show Modules
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CourseModulesTable showTable={showTable} courseId={courseId} />
                </Card>
            </Grid>
        </Grid>
    </ApexChartWrapper>
  )
}

export default ContentCreatorCourseModules

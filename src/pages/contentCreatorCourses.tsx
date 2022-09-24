// ** MUI Imports
import Color from 'color';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import PlusCircle from 'mdi-material-ui/PlusCircle'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useStore, UserType } from 'src/services/store'
import { useEffect, useState } from 'react'
import AddNewCourseForm from 'src/views/form-layouts/AddNewCourseForm'
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@mui/material/CardActionArea';
import { useTableland } from "../services/hooks/useTableland"
import { useRouter } from 'next/router'

  
const MAX_FETCH_RETRIES = 60; // max retries to fetch from provider when expecting a change
const FETCH_RETRY_TIMEOUT = 1000; // timeout between fetches when expecting a change

const useStyles = makeStyles(() => ({
    actionArea: {
      transition: '0.2s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
    card: () => ({
      boxShadow: 'none',
      '&:hover': {
        boxShadow: `0 6px 12px 0 ${Color("#bfafb2")
          .rotate(-12)
          .darken(0.2)
          .fade(0.5)}`,
      },
    })
  }));

const ContentCreatorCourses = () => {
    const router = useRouter();
    const {
        state: { provider, wallet },
      } = useStore();

    const [courses, setCourses] = useState({ columns: [], rows: [] });
    const [open, setOpen] = useState(false);
    const [contentCreatorId, setContentCreatorId] = useState(0);
    const { getContentCreatorId, getUserType, getContentCreatorCourses } = useTableland();
    const [isContentCreator, setIsContentCreator] = useState(false);
    const [userType, setUserType] = useState(0);

    const fetchCourses = async (retry = false, retries = 0) => {
      const id = parseInt(router.query.contentCreatorId as string, 0);
      console.log("ContentCreatorCourses: ContentCreatorId from router: " + id)
      let startTime = Math.floor(Date.now());
      let endTime = Math.floor(Date.now());
      let userTypeVar = userType;

      // check type of user 
      if (userType == 0) {
        startTime = Math.floor(Date.now());
        userTypeVar = await getUserType(provider, wallet);
        endTime = Math.floor(Date.now());
        console.log("Time to get user type: " + (endTime - startTime));
        setUserType(userTypeVar)
      }

      let isUserCC = false;
      if (userTypeVar == UserType.CONTENT_CREATOR) {
        setIsContentCreator(true);
        isUserCC = true;
      } 

      if (isUserCC) {
        let tb_contentCreatorId: number;
        if(isNaN(id)) {
          console.log("ContentCreatorCourses: Fetching Id from table...")

          // Get content creator id
          startTime = Math.floor(Date.now());
          tb_contentCreatorId = await getContentCreatorId(provider, wallet);
          console.log("ContentCreatorCourses: Content creator ID: " + tb_contentCreatorId)
          endTime = Math.floor(Date.now());
          console.log("ContentCreatorCourses: Time to get content creator ID: " + (endTime - startTime));
          setContentCreatorId(tb_contentCreatorId);
        } else {
          tb_contentCreatorId = id;
          setContentCreatorId(id);
        }

        // Fetch courses
        console.log("we got the ID: " + tb_contentCreatorId)
        console.log("Fetch Courses Call.....");
        startTime = Math.floor(Date.now());
        const newCourses = await getContentCreatorCourses(provider, tb_contentCreatorId);
        endTime = Math.floor(Date.now());
        console.log("ContentCreatorCourses: Time to get content creator courses: " + (endTime - startTime));

        const coursesLen = courses !== null ? courses.rows.length : 0;
        const newCoursesLen = newCourses !== null ? newCourses.rows.length : 0;
        console.log("coursesLen: " + coursesLen)
        console.log("newCoursesLen: " + newCoursesLen)

        if (
          retry &&
          retries < MAX_FETCH_RETRIES &&
          coursesLen === newCoursesLen
        ) {
          return setTimeout(
            () => fetchCourses(true, retries + 1),
            FETCH_RETRY_TIMEOUT
          );
        }
        console.log("Init load courses");
        setCourses(newCourses);
      }
    };
  
    //To fetch courses onload
    useEffect(() => {
      if (!provider) {
        return;
      }

      fetchCourses();
    }, [provider]);

    const cardStyles = useStyles();

  return (
    <ApexChartWrapper>
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>Courses</Typography>
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
            {isContentCreator ?
             <>
              {courses !== null && courses.rows.map((data) => {
                const randRating = Math.floor(Math.random() * (5 - 2 + 1)) + 2;
                const randReview = Math.floor(Math.random() * (40 - 5 + 1)) + 5;

                return ((data[0] != -1) &&
                  <Grid item xs={12} md={3}>
                    <CardActionArea className={cardStyles.actionArea}>
                        <Card classes={cardStyles.card}>
                            <CardMedia sx={{ height: '9.375rem' }} image='/images/cards/courseLogo.jpg' />
                            <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
                                <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                {data[2]}
                                </Typography>
                                <Box sx={{ mb: 2.75, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <Rating readOnly value={randRating} name='read-only' sx={{ marginRight: 2 }} />
                                    <Typography variant='body2'>{randRating} Star | {randReview} reviews</Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                  Description:{' '}
                                  <Box component='span' sx={{ fontWeight: 500 }}>
                                    {data[3]}
                                  </Box>
                                </Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                  Topic:{' '}
                                  <Box component='span' sx={{ fontWeight: 500 }}>
                                    {data[4]}
                                  </Box>
                                </Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                  Price:{' '}
                                  <Box component='span' sx={{ fontWeight: 500 }}>
                                    {data[5]}
                                  </Box>
                                </Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                  Rewards:{' '}
                                  <Box component='span' sx={{ fontWeight: 500 }}>
                                    {data[6]}
                                  </Box>
                                </Typography>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                  Creation Date:{' '}
                                  <Box component='span' sx={{ fontWeight: 500 }}>
                                    {data[9]}
                                  </Box>
                                </Typography>
                            </CardContent>
                        </Card>
                    </CardActionArea>
                </Grid>
                  )
              })}
              <Grid item xs={12} md={3}>
                  <CardActionArea className={cardStyles.actionArea}>
                      <Card classes={cardStyles.card}>
                      <CardContent
                          sx={{
                          display: 'flex',
                          textAlign: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          height: '16.625rem',
                          padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
                          }}
                          onClick={() => setOpen(true)}
                      >
                              <Avatar
                                  sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
                                  >
                                  <PlusCircle />
                              </Avatar>
                              <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
                                  Add New Course
                              </Typography>
                          </CardContent>
                      </Card>
                  </CardActionArea>
              </Grid>
             </> 
             : 
             <>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                This section is only for Content Creators
              </Typography>
             </>}
            
        </Grid>
        <Grid item xs={12} md={3}>
            <AddNewCourseForm contentCreatorId={contentCreatorId} 
                                open={open} 
                                onClose={() => setOpen(false)} 
                                onAdd={() => fetchCourses(true)} />         
        </Grid>
    </ApexChartWrapper>
  )
}

export default ContentCreatorCourses

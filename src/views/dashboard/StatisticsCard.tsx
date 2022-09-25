// ** React Imports
import { ReactElement, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'
import TrophyAward from 'mdi-material-ui/TrophyAward'


// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { useStore } from 'src/services/store'

interface DataType {
  stats: string
  title: string
  colors: Array<ThemeColor>
  icon: ReactElement
}

const salesData: DataType = 
  {
    stats: '245k',
    colors: ["primary","secondary","error","warning","info","success"],
    title: 'Sales',
    icon: <TrophyAward sx={{ fontSize: '1.75rem' }} />
  }

const renderStats = (topPerformers: any[]) => {

  return topPerformers.map((item, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${salesData.colors[Math.floor(Math.random()*salesData.colors.length)]}.main`
          }}
        >
          {salesData.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item[1]}</Typography>
          <Typography variant='h6'>{item[3]}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const StatisticsCard = () => {
  const {
    state: { contract },
  } = useStore();

  //To fetch top performer onload
  useEffect(() => {
    if (!contract) {
      return;
    }

    fetchTopPerformers();
  }, [contract]);

  const [topPerformers, setTopPerformers] = useState([]);

  const fetchTopPerformers = async () => {
    const newTopPerformers = await contract.getTopPerformers();
    setTopPerformers(newTopPerformers);
  };

  return (
    <Card>
      <CardHeader
        title='Statistics Card'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Congratulations to this month's top performers
            </Box>{' '}
            😎
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats(topPerformers)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard

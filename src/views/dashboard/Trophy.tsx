// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import { useStore } from 'src/services/store'
import { useEffect, useState } from 'react'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const Trophy = () => {
  // ** Hook
  const theme = useTheme()
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

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'
  const [topPerformers, setTopPerformers] = useState([]);

  const fetchTopPerformers = async () => {
    const newTopPerformers = await contract.getTopPerformers();
    setTopPerformers(newTopPerformers);
  };

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Congratulations {topPerformers.slice(0,1).map((item) => (item[1]))}! 🥳</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          Best performer of the month
        </Typography>
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
          ${topPerformers.slice(0,1).map((item) => (item[3]))}
        </Typography>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default Trophy

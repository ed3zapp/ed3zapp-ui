import * as React from 'react';

// ** Styled Component Import
import Color from 'color';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { useFourThreeCardMediaStyles } from '@mui-treasury/styles/cardMedia/fourThree';
import Divider from '@mui/material/Divider'
import { useStore } from 'src/services/store';
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

// ** Icons Imports
import Wallet from 'mdi-material-ui/Wallet'
import Pound from 'mdi-material-ui/Pound'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'

const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    [breakpoints.down('lg')]: {
      justifyContent: 'center',
    },
  },
}));

const useStyles = makeStyles(() => ({
  actionArea: {
    textAlign: 'center',
    display: 'flex',
    borderRadius: 16,
    transition: '0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  card: ({color}) => ({
    minWidth: 256,
    borderRadius: 16,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: `0 6px 12px 0 ${Color(color)
        .rotate(-12)
        .darken(0.2)
        .fade(0.5)}`,
    },
  }),
  content: ({}) => {
    return {
      padding: '1rem 1.5rem 1.5rem',
    };
  },
  title: {
    fontFamily: 'Keania One',
    fontSize: '2rem',
    color: '#fff',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Montserrat',
    color: '#fff',
    opacity: 0.87,
    marginTop: '2rem',
    fontWeight: 500,
    fontSize: 14,
  },
}));

const CustomCard = ({ classes, image, title, address, bounty, rank }) => {
  const mediaStyles = useFourThreeCardMediaStyles();

  return (
    <CardActionArea className={classes.actionArea}>
      <Card className={classes.card}>
        <CardMedia classes={mediaStyles} image={image} />
        <CardContent className={classes.content}>
          <Typography className={classes.title} variant={'h2'}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', pt: 10 }}>
            <Wallet sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
            <Typography variant='body2'>{address}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, pb: 2 }}>
            <CurrencyUsd sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
            <Typography variant='body2'>{bounty}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', pb: 2}}>
            <Pound sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
            <Typography variant='body2'>{rank}</Typography>
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

const LeaderBoard = () => {
  const gridStyles = useGridStyles();
  const styles = useStyles({ color: '#461F89' });
  const styles2 = useStyles({ color: '#4B2095' });
  const styles3 = useStyles({ color: '#6536B6' });
  const styles4 = useStyles({ color: '#7E49DA' });
  const allStyles = [styles, styles2, styles3, styles4];
  
  const {
    state: { contract },
  } = useStore();

  const [topPerformers, setTopPerformers] = useState([]);
  const fetchTopPerformers = async () => {
    const newTopPerformers = await contract.getTopPerformers();
    setTopPerformers(newTopPerformers);
  };

  //To fetch employees onload
  useEffect(() => {
      if (!contract) {
        return;
      }

      fetchTopPerformers();
    }, [contract]);

  return (
    <>
      <Grid classes={gridStyles} container spacing={10} textAlign='center' display='flex' justifyContent='center'>
        <Grid item xs={12}>
            <Typography variant='h5'>&#11088; Top Performers &#11088;</Typography>
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
        {topPerformers.map((performer, perfIndex) => ((performer[0] != 0) &&
          <Grid item>
            <CustomCard
              classes={allStyles[Math.floor(Math.random()*allStyles.length)]}
              title={performer[1]}
              address={performer[0].substring(0,5)+"..."+performer[0].substring((performer[0].length-4), performer[0].length)}
              bounty={performer[3]}
              rank={(perfIndex + 1)}
              image={
                '/images/misc/TP.png'
              }
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}


export default LeaderBoard

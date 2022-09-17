import React, { useState } from 'react';
import cx from 'clsx';
import Color from 'color';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import { useCoverCardMediaStyles } from '@mui-treasury/styles/cardMedia/cover';
import { Row, Item } from '@mui-treasury/components/flex';
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import ContentCreatorEnrollForm from 'src/views/form-layouts/ContentCreatorEnrollForm';
import LearnerEnrollForm from 'src/views/form-layouts/LearnerEnrollForm';


const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    overflow: 'auto',
    [breakpoints.only('xs')]: {
      '& > *:not(:first-child)': {
        paddingLeft: 0,
      },
    },
    [breakpoints.up('sm')]: {
      justifyContent: 'center',
    },
  },
}));

const useStyles = makeStyles(({ palette }) => ({
  color: ({ color }: { color: string }) => ({
    '&:before': {
      backgroundColor: Color(color)
        .darken(0.3)
        .desaturate(0.2)
        .toString(),
    },
  }),
  root: {
    position: 'relative',
    borderRadius: '1rem',
    minWidth: 320,
    '&:before': {
      transition: '0.2s',
      position: 'absolute',
      width: '100%',
      height: '100%',
      content: '""',
      display: 'block',
      borderRadius: '1rem',
      zIndex: 0,
      bottom: 0,
    },
    '&:hover': {
      '&:before': {
        bottom: -6,
      },
      '& $logo': {
        transform: 'scale(1.1)',
        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.38)',
      },
    },
  },
  cover: {
    borderRadius: '1rem',
  },
  content: ({ color }: { color: string }) => ({
    position: 'relative',
    zIndex: 1,
    borderRadius: '1rem',
    boxShadow: `0 6px 16px 0 ${Color(color).fade(0.5)}`,
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 0,
      width: '100%',
      height: '100%',
      clipPath:
        'polygon(0% 100%, 0% 35%, 0.3% 33%, 1% 31%, 1.5% 30%, 2% 29%, 2.5% 28.4%, 3% 27.9%, 3.3% 27.6%, 5% 27%,95% 0%,100% 0%, 100% 100%)',
      borderRadius: '1rem',
      background: `linear-gradient(to top, ${color}, ${Color(color)
        .rotate(24)
        .lighten(0.12)})`,
    },
  }),
  title: {
    fontFamily: 'Fjalla One',
    fontSize: '1.25rem',
    color: '#fff',
    margin: 0,
  },
  logo: {
    transition: '0.3s',
    width: 100,
    height: 100,
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.24)',
    borderRadius: '1rem',
  },
  team: {
    fontFamily: 'Sen',
    fontSize: '0.75rem',
    color: palette.text.hint,
  },
  date: {
    fontFamily: 'Sen',
    color: '#fff',
    backgroundColor: palette.text.hint,
    opacity: 0.72,
    fontSize: '0.75rem',
    padding: '0 0.5rem',
    borderRadius: 12,
  },
}));

const CustomCard = ({ styles, cover, logo, title, brand, date }) => {
  const mediaStyles = useCoverCardMediaStyles();

  return (
    <Box className={cx(styles.root, styles.color)} pt={20}>
      <CardMedia image={cover} className={styles.cover} classes={mediaStyles} />
      <Box className={styles.content} p={2}>
        <Box position={'relative'} zIndex={1}>
          <Row p={0} gap={2}>
            <Item>
              <Avatar className={styles.logo} src={logo} />
            </Item>
            <Item position={'bottom'}>
              <h2 className={styles.title}>{title}</h2>
            </Item>
          </Row>
          <Row mt={4} alignItems={'center'}>
            <Item>
              <div className={styles.team}>{brand}</div>
            </Item>
            <Item position={'right'}>
              <div className={styles.date}>{date}</div>
            </Item>
          </Row>
        </Box>
      </Box>
    </Box>
  );
};

export const ChooseRole = React.memo(function HighlightCard()  {
    const styles1 = useStyles({ color: '#5357ce' });
    const gridStyles = useGridStyles();
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);

    return (
        <>
        
        <Grid item xs={12}>
            <Typography variant='h5' sx={{textAlign: 'center', alignItems: 'center'}}>Choose Your Role</Typography>
            <Divider
                textAlign='left'
                sx={{
                paddingTop: 2,
                m: 0,
                width: '100%',
                lineHeight: 'normal',
                textTransform: 'uppercase',
                '&:before, &:after': { top: 7, transform: 'none' },
                '& .MuiDivider-wrapper': { px: 2.5, fontSize: '0.75rem', letterSpacing: '0.21px' }
                }}
            />
        </Grid>
        <Grid
            style={{ padding: 16 }}
            classes={gridStyles}
            wrap={'nowrap'}
            container
            spacing={4}
        >
            <Grid item onClick={() => setOpen1(true)}>
                <CustomCard
                    styles={styles1}
                    brand={''}
                    date={''}
                    cover={
                      '/images/misc/sponsor.png'
                    }
                    logo={
                      '/images/misc/sponsorbox.png'
                    }
                    title={
                    <>
                        Learner
                    </>
                    }
                />
            </Grid>
            <Grid item onClick={() => setOpen2(true)}>
                <CustomCard
                    styles={styles1}
                    brand={''}
                    date={''}
                    cover={
                      '/images/misc/creator.png'
                    }
                    logo={
                      '/images/misc/creatorbox.png'
                    }
                    title={
                    <>
                        Content Creator
                    </>
                    }
                />
            </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
            <LearnerEnrollForm open1={open1} onClose={() => setOpen1(false)} />         
        </Grid>
        <Grid item xs={12} md={3}>
            <ContentCreatorEnrollForm open2={open2} onClose={() => setOpen2(false)} />         
        </Grid>
        </>
    );
});

export default ChooseRole

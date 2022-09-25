// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import RunningBalance from 'src/layouts/components/RunningBalance'
import React, { useEffect, useState } from "react";
import { getUSDCXBalance } from "../../services/usdcx_contract";
import { ethers } from "ethers";
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Types
import { flowDetails } from 'src/services/hooks/useSFsdk'
import { useStore } from 'src/services/store'
import ConvertCoinsForm from '../form-layouts/ConvertCoinsForm'

const TotalEarning = () => {
  
  const {
    state: { contract, provider, wallet },
  } = useStore();
  
  const [balance, setBalance] = useState<number>();
  const [netFlow, setNetFlow] = useState<number>(0);
  
  useEffect(() => {
    if (!provider) {
      return;
    }
    const id = setInterval(() => {
      updateBalance();
    }, 25000);
  
    updateBalance();
    updateNetFlow();
    return () => clearInterval(id);
  }, [provider]);

  const [completedCourses, setCompletedCourses] = useState([]);
  const fetchCompletedCourses = async () => {
    const completedCourses = await contract.fetchCompletedCourses();
    setCompletedCourses(completedCourses);
  }

  //To fetch courses onload
  useEffect(() => {
    if (!contract) {
      return;
    }

    fetchUserType()
    fetchCompletedCourses();
  }, [contract]);
  
  const updateBalance = () => {
    getUSDCXBalance(provider, wallet).then((value) => {
      console.log("Wallet:" + wallet);
      setBalance(parseFloat(value));
    });
  };
  
  const updateNetFlow = async () => {
    const result = await flowDetails(wallet);
    console.log("updateNetFlow, result: " + result);
    console.log("updateNetFlow, result.cfa.netFlow: " + result.cfa.netFlow);
    setNetFlow(parseFloat(ethers.utils.formatEther(result.cfa.netFlow)));
  };

  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState("");
  const fetchUserType = async () => {
    const result = await contract.getUserType(wallet);
    console.log("Usertype: " + result);
    setUserType(result);
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Total Earning (in USDCx)'
          titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
          action={
            <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
              <DotsVertical />
            </IconButton>
          }
        />
        <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
          <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
            <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
              {balance ? <RunningBalance value={balance} rate={netFlow} /> : "$0" }
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
              <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
                10%
              </Typography>
            </Box>
          </Box>

          <Typography component='p' variant='caption' sx={{ mb: 10 }}>
              {(userType == "2") ? (
                <Button variant='contained' size='large' 
                onClick={() => setOpen(true)}>
                  Convert to USDC
                </Button>
              ) : ""}
          </Typography>

          {completedCourses.map((completeCourse, index) => {
            return (
              ((completeCourse[0] != 0) && 
              <Box
                key={completeCourse[1]}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ...(index !== completedCourses.length - 1 ? { mb: 8.5 } : {})
                }}
              >
                <Avatar
                  variant='rounded'
                  sx={{
                    mr: 3,
                    width: 40,
                    height: 40,
                    backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`
                  }}
                >
                  <img src='/images/cards/logo-aviato.png' alt={completeCourse[1]} height={20} />
                </Avatar>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                    {completeCourse[1]}
                    </Typography>
                    <Typography variant='caption'>{completeCourse[2]}</Typography>
                  </Box>

                  <Box sx={{ minWidth: 200, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='body2' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                      ${completeCourse[5]}
                    </Typography>
                    <LinearProgress color='primary' value={100} variant='determinate' />
                  </Box>
                </Box>
              </Box>
              ))
          })}
        </CardContent>
      </Card>
      <Grid item xs={12} md={3}>
          <ConvertCoinsForm open={open} onClose={() => setOpen(false)} onTransfer={() => updateBalance()} />         
      </Grid>
    </>
  )
}

export default TotalEarning

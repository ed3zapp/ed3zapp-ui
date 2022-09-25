// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState } from 'react'
import { useStore } from 'src/services/store'
import { unWrapToken } from "../../services/hooks/useSFsdk";
import { ethers } from "ethers";


interface IProps {
    open: boolean;
    onClose: () => void;
    onTransfer: (newBalance: number) => void;
  }

const ConvertCoinsForm: React.FC<IProps> = ({open, onClose, onTransfer}) => {
    const {
        state: { provider, wallet },
      } = useStore();
      
    const [amount, setAmount] = useState(0);
    const handleTransfer = async (amount: number) => {
        console.log("handleTransfer...." + amount);
        try {
          const result = await unWrapToken(amount, provider, wallet);
          console.log("After unwrapToken....");
          onClose();
          onTransfer(
            parseFloat(ethers.utils.formatEther(result.newBalances.USDCxBalance))
          );
        } catch (error) {
          console.error("Error converting to USDC: " + error);
        }
      };

  return (
   <>
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
            <Card>
                <CardContent>
                    <form onSubmit={e => e.preventDefault()}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                        <TextField fullWidth label='Amount' onChange={(value) => setAmount(parseFloat(value.currentTarget.value))} />
                        </Grid>
                        <Grid item xs={12}>
                        <Box
                            sx={{
                            gap: 5,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                            }}
                        >
                            <Button type='submit' variant='contained' size='large' onClick={() => handleTransfer(amount)} disabled={!amount}>
                                Withdraw
                            </Button>
                            <Button type='submit' variant='contained' size='large' onClick={onClose} >
                                Cancel
                            </Button>
                        </Box>
                        </Grid>
                    </Grid>
                    </form>
                </CardContent>
            </Card>
        </DialogContent>
    </Dialog>
   </>
  )
}

export default ConvertCoinsForm

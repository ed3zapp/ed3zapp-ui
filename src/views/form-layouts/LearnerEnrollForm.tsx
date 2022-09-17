// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react'
import { useRouter } from 'next/router'
import { UserType, useStore } from 'src/services/store'
import { TABLE_TYPE, useTableland } from "../../services/hooks/useTableland"
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from 'mdi-material-ui/SendCircle';
import CloseIcon from 'mdi-material-ui/CloseThick';

interface IProps {
    open1: boolean;
    onClose: () => void;
  }

const LearnerEnrollForm: React.FC<IProps> = ({open1, onClose}) => {
    const router = useRouter();

    const {
        state: { provider, wallet },
      } = useStore();
      
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const handleLearnerOnboard = async () => {
        console.log("lagCheck: handleLearnerOnboard func is called")
        let startTime = Math.floor(Date.now()); // in seconds
        let endTime = Math.floor(Date.now()); // in seconds

        setLoading(true);
        const { grantUserAccessToTable, userTableEntry, learnerTableEntry } = useTableland();

        // Grant access to users table
        console.log("Before grantUserAccessToTable call")
        startTime = Math.floor(Date.now());
        const uesrsAccessGrantResult = await grantUserAccessToTable(provider, wallet, TABLE_TYPE.USERS);
        console.log("Users table access grant to user status: " + uesrsAccessGrantResult);
        endTime = Math.floor(Date.now());
        console.log("LeanerEnrollForm: Time to provide grant to users: " + (endTime - startTime));

        // User type entry
        console.log("Before userTableEntry call")
        startTime = Math.floor(Date.now());
        const tableEntryResult = await userTableEntry(provider, {
            userType: UserType.LEARNER,
            userAddress: wallet
        });
        console.log("New Learner user type entry to table status: " + tableEntryResult)
        endTime = Math.floor(Date.now());
        console.log("LeanerEnrollForm: Time to insert usertype: " + (endTime - startTime));

        // Grant access to learners table
        console.log("Before grantUserAccessToTable call")
        startTime = Math.floor(Date.now());
        const learnersAccessGrantResult = await grantUserAccessToTable(provider, wallet, TABLE_TYPE.LEARNERS);
        console.log("Learners table access grant to user status: " + learnersAccessGrantResult)
        endTime = Math.floor(Date.now());
        console.log("LeanerEnrollForm: Time to provide grant to learners: " + (endTime - startTime));

        // Learner details entry
        console.log("Before learnerTableEntry call")
        startTime = Math.floor(Date.now());
        const learnerDetailsEntryResult = await learnerTableEntry(provider, {
            userName: name,
            userAddress: wallet,
            userBio: bio
        });
        console.log("New Learner details entry to table status: " + learnerDetailsEntryResult)
        endTime = Math.floor(Date.now());
        console.log("LeanerEnrollForm: Time to insert learners: " + (endTime - startTime));

        setLoading(false);
        onClose()
        router.push("/learnerTest");
      };

  return (
   <>
    <Dialog open={open1} onClose={onClose}>
        <DialogTitle>Enroll</DialogTitle>
        <DialogContent>
            <Card>
                <CardContent>
                    <form onSubmit={e => e.preventDefault()}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <TextField fullWidth label='Name' onChange={(value) => setName(value.currentTarget.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label='Bio' onChange={(value) => setBio(value.currentTarget.value)} />
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
                            <LoadingButton
                                type='submit'
                                size='large'
                                onClick={handleLearnerOnboard}
                                endIcon={<SendIcon />}
                                loading={loading}
                                loadingPosition="end"
                                variant="contained"
                                disabled={!name}
                                >
                            Send
                            </LoadingButton>
                            <LoadingButton
                                type='submit'
                                size='large'
                                onClick={onClose}
                                endIcon={<CloseIcon />}
                                loading={false}
                                loadingPosition="end"
                                variant="contained"
                                >
                            Cancel
                            </LoadingButton>
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

export default LearnerEnrollForm

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
    open2: boolean;
    onClose: () => void;
  }

const ContentCreatorEnrollForm: React.FC<IProps> = ({open2, onClose}) => {
    const router = useRouter();

    const {
        state: { provider, wallet },
      } = useStore();
      
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const handleContentCreatorOnboard = async () => {
        let startTime = Math.floor(Date.now()); // in seconds
        let endTime = Math.floor(Date.now()); // in seconds

        setLoading(true);
        const { grantUserAccessToTable, 
                    userTableEntry, 
                    contentCreatorTableEntry,
                    getContentCreatorId
                } = useTableland();

        // Grant access to users table
        startTime = Math.floor(Date.now());
        const usersAccessGrantResult = await grantUserAccessToTable(provider, wallet, TABLE_TYPE.USERS);
        console.log("Users table access grant to user status: " + usersAccessGrantResult)
        endTime = Math.floor(Date.now());
        console.log("CCEnrollForm: Time to provide grant to users: " + (endTime - startTime));

        // User type entry
        startTime = Math.floor(Date.now());
        const tableEntryResult = await userTableEntry(provider, {
            userType: UserType.CONTENT_CREATOR,
            userAddress: wallet
        });
        console.log("New Content Creator user type entry to table status: " + tableEntryResult)
        endTime = Math.floor(Date.now());
        console.log("CCEnrollForm: Time to insert usertype: " + (endTime - startTime));

        // Grant access to content_creators table
        startTime = Math.floor(Date.now());
        const ccAccessGrantResult = await grantUserAccessToTable(provider, wallet, TABLE_TYPE.CONTENT_CREATORS);
        console.log("Content Creators table access grant to user status: " + ccAccessGrantResult)
        endTime = Math.floor(Date.now());
        console.log("CCEnrollForm: Time to provide grant to user: " + (endTime - startTime));

        // Content Creator details entry
        startTime = Math.floor(Date.now());
        const ccDetailsEntryResult = await contentCreatorTableEntry(provider, {
            userName: name,
            userAddress: wallet,
            userBio: bio
        });
        console.log("New Content Creator details entry to table status: " + ccDetailsEntryResult)
        endTime = Math.floor(Date.now());
        console.log("CCEnrollForm: Time to insert cc: " + (endTime - startTime));
        
        // Grant access to cc_courses table
        startTime = Math.floor(Date.now());
        const ccCoursesAccessGrantResult = await grantUserAccessToTable(provider, wallet, TABLE_TYPE.CC_COURSES);
        console.log("Content Creators table access grant to cc_courses status: " + ccCoursesAccessGrantResult)
        endTime = Math.floor(Date.now());
        console.log("CCEnrollForm: Time to provide grant to cc_courses: " + (endTime - startTime));

        // Grant access to cc_modules table
        startTime = Math.floor(Date.now());
        const ccCourseModulesAccessGrantResult = await grantUserAccessToTable(provider, wallet, TABLE_TYPE.CC_COURSE_MODULES);
        console.log("Content Creators table access grant to cc_modules status: " + ccCourseModulesAccessGrantResult)
        endTime = Math.floor(Date.now());
        console.log("CCEnrollForm: Time to provide grant to cc_modules: " + (endTime - startTime));

        // Get content creator id
        startTime = Math.floor(Date.now());
        const tb_contentCreatorId = await getContentCreatorId(provider, wallet);
        console.log("Content creator ID: " + tb_contentCreatorId)
        endTime = Math.floor(Date.now());
        console.log("CCEnrollForm: Time to get content creator ID: " + (endTime - startTime));

        setLoading(false);
        onClose()
        router.push({
            pathname: '/contentCreatorCourses',
            query: {
                contentCreatorId: tb_contentCreatorId
            }
        }, '/contentCreatorCourses');
      };

  return (
   <>
    <Dialog open={open2} onClose={onClose}>
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
                                onClick={handleContentCreatorOnboard}
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

export default ContentCreatorEnrollForm

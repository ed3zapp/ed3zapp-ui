// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import { useStore } from 'src/services/store'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from 'mdi-material-ui/SendCircle';
import CloseIcon from 'mdi-material-ui/CloseThick';

interface IProps {
  contentCreatorId: number;
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddNewCourseForm: React.FC<IProps> = ({ contentCreatorId, open, onClose, onAdd }) => {
  console.log("params: " + contentCreatorId + "," + open + ",")
  const {
    state: { contract },
  } = useStore();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [topic, setTopic] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const createNewCourse = async (name: string, desc: string, price: number, topic: string) => {
    try {
      setLoading(true)
      console.log("AddNewCourseForm: " + contentCreatorId +","+ name +","+ desc +","+ price +","+ topic)
      await contract.createCourse(contentCreatorId, name, desc, price, topic, (new Date()).getTime());
      onAdd();
      setLoading(false)
    } catch (error) {
      console.log("AddNewCourseForm: Error creating course: " + error)
    } finally {
      console.log("AddNewCourseForm: Close window")
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Course</DialogTitle>
      <DialogContent>
        <Card>
          <CardContent>
            <form onSubmit={e => e.preventDefault()}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <TextField fullWidth label='Name' onChange={(value) => setName(value.currentTarget.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label='Description' onChange={(value) => setDesc(value.currentTarget.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label='Topic' onChange={(value) => setTopic(value.currentTarget.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label='Price' onChange={(value) => setPrice(parseInt(value.currentTarget.value, 0))} />
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
                      onClick={() => createNewCourse(name, desc, price, topic)}
                      endIcon={<SendIcon />}
                      loading={loading}
                      loadingPosition="end"
                      variant="contained"
                      disabled={!name || !desc|| !topic || !price}
                      >
                  Submit
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
  )
}

export default AddNewCourseForm

// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import CreateIcon from "@material-ui/icons/Create";
import {
  Alert, Paper, TableContainer,
    Box, Button, Snackbar, Table,
    TableBody, TableCell, TableHead, TableRow
} from "@mui/material";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IProps {
  courseId: number;
}

// Creating styles
const useStyles = makeStyles({
  root: {
      "& > *": {
          borderBottom: "unset",
      },
  },
  table: {
      minWidth: 650,
  },
  snackbar: {
      bottom: "104px",
  },
});

const CourseModulesTable: React.FC<IProps> = ({ courseId }) => {
 
  const currDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(Date.now());
  // Creating style object
  const classes = useStyles();
  
  // Defining a state named rows
  // which we can update by calling on setRows function
  const [rows, setRows] = useState([
      { id: 1, courseName: "", courseDesc: "", videoURL: "", videoLength: "", questionnaireURL: "", maxAttempts: 0, rewardPrice: 0, rewardsValidity: 0, creationDate: currDate },
  ]);

  // Initial states
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [disable, setDisable] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // Function For closing the alert snackbar
  const handleClose = (event, reason) => {
      if (reason === "clickaway") {
          return;
      }
      setOpen(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
        return;
    }
    setOpenError(false);
};

  // Function For adding new row object
  const handleAdd = () => {
      setRows([
          ...rows,
          {
              id: rows.length + 1, courseName: "", courseDesc: "", videoURL: "", videoLength: "", 
              questionnaireURL: "", maxAttempts: 0, rewardPrice: 0, rewardsValidity: 0, creationDate: currDate,
          },
      ]);
      setEdit(true);
  };

  // Function to handle edit
  const handleEdit = (i) => {
      // If edit mode is true setEdit will 
      // set it to false and vice versa
      setEdit(!isEdit);
  };

  const [alertErrMessage, setAlertErrMessage] = useState("");
  // Function to handle save
  const handleSave = () => {
      let isError = false;

      rows.map((row) => {
        if (typeof row.courseName === "string" && row.courseName.trim().length === 0) {
          setAlertErrMessage("Course name cannot be empty!");
          isError = true;
        } else if (typeof row.courseDesc === "string" && row.courseDesc.trim().length === 0) {
          setAlertErrMessage("Course description cannot be empty!");
          isError = true;
        }
      });

      if (isError) {
        setOpenError(true);
      } else {
        setEdit(!isEdit);
        setRows(rows);
        console.log("saved : ", rows);
        setDisable(true);
        setOpen(true);
      }
  };

  // The handleInputChange handler can be set up to handle
  // many different inputs in the form, listen for changes 
  // to input elements and record their values in state
  const handleInputChange = (e, index) => {
      setDisable(false);
      const { name, value } = e.target;
      const list = [...rows];
      list[index][name] = value;
      setRows(list);
  };

  // Showing delete confirmation to users
  const handleConfirm = () => {
      setShowConfirm(true);
  };

  // Handle the case of delete confirmation where 
  // user click yes delete a specific row of id:i
  const handleRemoveClick = (i) => {
      const list = [...rows];
      list.splice(i, 1);
      setRows(list);
      setShowConfirm(false);
  };

  // Handle the case of delete confirmation 
  // where user click no 
  const handleNo = () => {
      setShowConfirm(false);
  };


  return (

      <TableContainer component={Paper}>
          <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            className={classes.snackbar}
          >
            <Alert onClose={() => handleClose} severity="success">
              Record Saved Successfully!
            </Alert>
          </Snackbar>
          <Snackbar
            open={openError}
            autoHideDuration={4000}
            onClose={handleCloseError}
            className={classes.snackbar}
          >
            <Alert onClose={() => handleCloseError} severity="error">
              {alertErrMessage}
            </Alert>
          </Snackbar>
          <Box sx={{margin:1, display: "flex"}}>
            {isEdit ? (
              <>
                <Button onClick={handleAdd}>
                  <AddBoxIcon onClick={handleAdd} />
                  ADD
                </Button>
                
                {rows.length !== 0 && (
                  <>
                    {disable ? (
                      <Button disabled  onClick={handleSave}>
                        <DoneIcon />
                        SAVE
                      </Button>
                    ) : (
                      <Button  onClick={handleSave}>
                        <DoneIcon />
                        SAVE
                      </Button>
                    )}
                    </>
                )}
                </>
                
            ) : (
              <>
                <Button onClick={handleAdd}>
                  <AddBoxIcon onClick={handleAdd} />
                  ADD
                </Button>
                <Button  onClick={handleEdit}>
                  <CreateIcon />
                  EDIT
                </Button>
              </>
            )}
          </Box>
      
          
            <Table
              className={classes.table}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Course Description</TableCell>
                  <TableCell>Video URL</TableCell>
                  <TableCell>Video Length</TableCell>
                  <TableCell>Questionnaire URL</TableCell>
                  <TableCell>Max Attempts</TableCell>
                  <TableCell>Reward Price</TableCell>
                  <TableCell>Rewards Validity</TableCell>
                  <TableCell>Creation Date</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => {
                  return (
                    <>
                      <TableRow>
                        {isEdit ? (
                          <>
                            <TableCell padding="none">
                              <input
                                value={row.courseName}
                                name="courseName"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <input
                                value={row.courseDesc}
                                name="courseDesc"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <input
                                value={row.videoURL}
                                name="videoURL"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <input
                                value={row.videoLength}
                                name="videoLength"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <input
                                value={row.questionnaireURL}
                                name="questionnaireURL"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <input
                                type="number"
                                value={row.maxAttempts}
                                name="maxAttempts"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <input
                                type="number"
                                value={row.rewardPrice}
                                name="rewardPrice"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <input
                                type="number"
                                value={row.rewardsValidity}
                                name="rewardsValidity"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              {row.creationDate}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell component="th" scope="row">
                              {row.courseName}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.courseDesc}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.videoURL}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.videoLength}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.questionnaireURL}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.maxAttempts}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.rewardPrice}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.rewardsValidity}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.creationDate}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            ></TableCell>
                          </>
                        )}
                        {isEdit ? (
                          <Button className="mr10" onClick={handleConfirm}>
                            <ClearIcon />
                          </Button>
                        ) : (
                          <Button className="mr10" onClick={handleConfirm}>
                            <DeleteOutlineIcon />
                          </Button>
                        )}
                        {showConfirm && (
                          <>
                            <Dialog
                              open={showConfirm}
                              onClose={handleNo}
                            >
                              <DialogTitle>Are you sure you want to delete?</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  <Button
                                    onClick={() => handleRemoveClick(i)}
                                    color="primary"
                                    autoFocus
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    onClick={handleNo}
                                    color="primary"
                                    autoFocus
                                  >
                                    No
                                  </Button>
                                </DialogContentText>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          
        
        </TableContainer>

    
  )
}

export default CourseModulesTable

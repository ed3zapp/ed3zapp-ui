// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import CreateIcon from "@material-ui/icons/Create";
import {
  Alert, Paper, TableContainer,
    Box, Button, Snackbar, Table,
    TableBody, TableCell, TableHead, TableRow, IconButton
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
import { useTableland } from "../../services/hooks/useTableland";
import { useStore, UserType } from 'src/services/store';
import { storeWithProgress, makeVideoObject, makeFileUrl } from '../../services/web3StorageUtils';
import VideoVintage from 'mdi-material-ui/VideoVintage'

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

interface CourseModulesTableType {
  id: number;
  moduleName: string;
  moduleDesc: string;
  videoURL: File;
  videoIpfsUrl: string;
  questionnaireURL: string;
  questionnaireIpfsUrl: string;
  maxAttempts: number;
  rewardPrice: number;
  rewardsValidity: number;
  creationDate: string;
}

interface IProps {
  showTable: boolean;
  courseId: number;
}

const CourseModulesTable: React.FC<IProps> = ({ showTable, courseId }) => {
  const {
    state: { provider, wallet },
  } = useStore();

  const currDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(Date.now());
  // Creating style object
  const classes = useStyles();
  
  // Defining a state named rows
  // which we can update by calling on setRows function
  const [rows, setRows] = useState<CourseModulesTableType[]>([])

  // Initial states
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [disable, setDisable] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const { ccCourseModulesTableEntry, getUserType, 
    getContentCreatorCourseModules } = useTableland();

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
              id: rows.length + 1, moduleName: "", moduleDesc: "", videoURL: null,
              videoIpfsUrl: "", questionnaireURL: "", questionnaireIpfsUrl: "",
              maxAttempts: 0, rewardPrice: 0, rewardsValidity: 0, creationDate: currDate
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
  const handleSave = async() => {
      let isError = false;

      rows.map((row, index) => {
        const rowNum = index + 1;
        if (typeof row.moduleName === "string" && row.moduleName.trim().length === 0) {
          setAlertErrMessage("Row " + rowNum + ": Course name cannot be empty!");
          isError = true;
        } else if (typeof row.moduleDesc === "string" && row.moduleDesc.trim().length === 0) {
          setAlertErrMessage("Row " + rowNum + ": Course description cannot be empty!");
          isError = true;
        } else if (row.videoURL === null) {
          setAlertErrMessage("Row " + rowNum + ": Video URL cannot be empty!");
          isError = true;
        } else if (typeof row.questionnaireURL === "string" && row.questionnaireURL.trim().length === 0) {
          setAlertErrMessage("Row " + rowNum + ": Questionnaire URL cannot be empty!");
          isError = true;
        } else if (typeof row.maxAttempts === "number" && row.maxAttempts > 0) {
          setAlertErrMessage("Row " + rowNum + ": Maximum attempts cannot be 0!");
          isError = true;
        } else if (typeof row.rewardPrice === "number" && row.rewardPrice > 0) {
          setAlertErrMessage("Row " + rowNum + ": Reward price cannot be 0!");
          isError = true;
        } else if (typeof row.rewardsValidity === "number" && row.rewardsValidity > 0) {
          setAlertErrMessage("Row " + rowNum + ": Reward validity cannot be 0!");
          isError = true;
        }
      });

      if (isError) {
        setOpenError(true);
      } else {
        rows.map((row, index) => {
          uploadToIPFS(row.videoURL, index, "video");
        });

        sqlTableEntry(rows)

        setEdit(!isEdit);
        setRows(rows);
        console.log("saved : ", rows);
        setDisable(true);
        setOpen(true);
      }
  };

  const handleVideoChange = (e, index) => {
    setDisable(false);
    if (!e.target.files) {
      return;
    }
    const { name, value } = e.target;
    console.log("handleVideoChange1: " + name);
    console.log("handleVideoChange2: " + value);
    const file = e.target.files[0];
    console.log("handleVideoChange: file: " + file);
    const list = [...rows];
    list[index][name] = file;
    setRows(list); 
  }

  const uploadToIPFS = async (file: File, index: number, type: string) => {
    console.log("Uploading file to IPFS...");

    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    let fileArrayBuffer: ArrayBuffer;
    try {
    reader.onload = function(e) {
      fileArrayBuffer = reader.result as ArrayBuffer;
    }
    reader.onerror = function (error) {
      console.log('Error reading JSON file: ', error);
    };
    } catch (error) {
      console.log("Error parsing video file: " + error)
    }

    const fileObj = makeVideoObject(fileArrayBuffer, file.name);
    const cid = await storeWithProgress([fileObj], false);
    console.log("cid: " + cid)
    const videFileURL = makeFileUrl(cid, file.name);
    console.log("videFileURL: " + videFileURL)

    const list = [...rows];
    list[index]["videoIpfsUrl"] = videFileURL;
    setRows(list); 
  }

  const sqlTableEntry = async(rows: CourseModulesTableType[]) => {

    // Content Creator course modules details entry
    rows.map(async (row, index) => {
      const counter = index + 1;
      console.log("CourseModulesTable: sqlTableEntry: Table entry: " + counter)

      let startTime = Math.floor(Date.now());
      const ccDetailsEntryResult = await ccCourseModulesTableEntry(provider, {
        ccCourseId: row.id,
        moduleName: row.moduleName,
        moduleDescription: row.moduleDesc,
        videoURL: row.videoIpfsUrl,
        questionnaireURL: row.questionnaireIpfsUrl,
        maxAttempts: row.maxAttempts,
        rewardPrice: row.rewardPrice,
        rewardValidity: row.rewardsValidity
      });
      console.log("CourseModulesTable: sqlTableEntry: table entry result: " + ccDetailsEntryResult);
      let endTime = Math.floor(Date.now());
      console.log("CourseModulesTable: sqlTableEntry: Time to insert cc modules: " + (endTime - startTime));
    });
  }

  const [userType, setUserType] = useState(0);
  const [isContentCreator, setIsContentCreator] = useState(false);
  const [contentCreatorId, setContentCreatorId] = useState(0);
  const [courses, setCourses] = useState({ columns: [], rows: [] });

  const fetchCourses = async () => {
    let startTime = Math.floor(Date.now());
    let endTime = Math.floor(Date.now());
    let userTypeVar = userType;

    // check type of user 
    if (userType == 0) {
      startTime = Math.floor(Date.now());
      userTypeVar = await getUserType(provider, wallet);
      endTime = Math.floor(Date.now());
      console.log("CourseModulesTable: Time to get user type: " + (endTime - startTime));
      setUserType(userTypeVar)
    }

    console.log("CourseModulesTable: userTypeVar: " + userTypeVar)
    let isUserCC = false;
    if (userTypeVar == UserType.CONTENT_CREATOR) {
      setIsContentCreator(true);
      isUserCC = true;
    } 

    console.log("CourseModulesTable: isUserCC: " + isUserCC)
    if (isUserCC) {

      console.log("courseId undef???: " + (courseId == undefined))
      const courseIdVal = courseId !== undefined ? courseId : 0;
      console.log("courseId undef fixed???: " + courseIdVal)
      console.log("CourseModulesTable: inside IF: " + courseId)
      // Get content creator course modules
      startTime = Math.floor(Date.now());
      const newCourses = await getContentCreatorCourseModules(provider, courseIdVal);
      endTime = Math.floor(Date.now());
      console.log("CourseModulesTable: Time to get content creator courses: " + (endTime - startTime));

      let x = newCourses !== null ? newCourses.rows.length : 0;
      console.log("CourseModulesTable: Set courses: " +  x);
      setCourses(newCourses);

      const tempRows: CourseModulesTableType[] = []; 
      const tempRowObject: CourseModulesTableType = null;
      setRows([]);

      newCourses.rows.map((row, index) => {
        tempRowObject.id = rows.length + 1;
        tempRowObject.moduleName = row[2];
        tempRowObject.moduleDesc = row[3];
        tempRowObject.videoURL = row[4];
        tempRowObject.questionnaireURL = row[5];
        tempRowObject.maxAttempts = row[6];
        tempRowObject.rewardPrice = row[7];
        tempRowObject.rewardsValidity = row[8];
        tempRowObject.creationDate = row[9];
        tempRows.push(tempRowObject);
      })
      x = tempRows !== null ? tempRows.length : 0;
      console.log("CourseModulesTable: Set courses: " +  x);
      setRows(tempRows);
    }
  }

  //To fetch courses onload
  /*useEffect(() => {
    if (!provider) {
      return;
    }

    fetchCourses();
  }, [provider]);*/


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
      (showTable ? 
        <>
        <p>comes here: {fetchCourses()}</p>
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
                  <TableCell>Module Name</TableCell>
                  <TableCell>Module Description</TableCell>
                  <TableCell>Video URL</TableCell>
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
                                value={row.moduleName}
                                name="moduleName"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <input
                                value={row.moduleDesc}
                                name="moduleDesc"
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <IconButton color="primary" aria-label="upload video" component="label" >
                                <input name="videoURL" hidden accept="video/*" type="file" onChange={(e) => handleVideoChange(e, i)} />
                                <VideoVintage />
                              </IconButton>
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
                              {row.moduleName}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.moduleDesc}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.videoURL}
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
        </>
      : "")
  )
}

export default CourseModulesTable

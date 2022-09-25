// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useEffect, useRef, useState } from 'react'
import { useStore, UserType } from 'src/services/store'
import { useTableland } from "../services/hooks/useTableland"
import {
  Alert, Paper, TableContainer, Box, Button, Snackbar, Table,
    TableBody, TableCell, TableHead, TableRow, IconButton
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import VideoVintage from 'mdi-material-ui/VideoVintage'
import CodeJson from 'mdi-material-ui/CodeJson'
import { makeStyles } from "@material-ui/core/styles";
import { storeWithProgress, makeVideoObject, makeFileUrl, makeFileObject } from '../services/web3StorageUtils';
import AddBoxIcon from "@material-ui/icons/AddBox";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CreateIcon from "@material-ui/icons/Create";

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const ContentCreatorCourseModules: React.FC = () => {
  const {
    state: { provider, wallet },
  } = useStore();

  const { getUserType, getContentCreatorCourses, getContentCreatorCourseModules, ccCourseModulesTableEntry } = useTableland();
  const [userType, setUserType] = useState(0);
  const [isContentCreator, setIsContentCreator] = useState(false);
  const [courses, setCourses] = useState({ columns: [], rows: [] });
  const [courseModules, setCourseModules] = useState({ columns: [], rows: [] });
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const fetchCourses = async () => {
    let startTime = Math.floor(Date.now());
    let endTime = Math.floor(Date.now());
    let userTypeVar = userType;

    // check type of user 
    if (userType == 0) {
      startTime = Math.floor(Date.now());
      userTypeVar = await getUserType(provider, wallet);
      endTime = Math.floor(Date.now());
      console.log("ContentCreatorCourseModules: Time to get user type: " + (endTime - startTime));
      setUserType(userTypeVar)
    }

    let isUserCC = false;
    if (userTypeVar == UserType.CONTENT_CREATOR) {
      setIsContentCreator(true);
      isUserCC = true;
    } 

    if (isUserCC) {

      // Get content creator courses
      startTime = Math.floor(Date.now());
      const newCourses = await getContentCreatorCourses(provider, wallet);
      endTime = Math.floor(Date.now());
      console.log("ContentCreatorCourseModules: Time to get content creator courses: " + (endTime - startTime));

      const newCoursesSize = newCourses !== null ? newCourses.rows.length : 0;
      console.log("ContentCreatorCourseModules: Set courses: " +  newCoursesSize);
      setCourses(newCourses);
    
    }
  }

  //To fetch courses onload
  useEffect(() => {
    if (!provider) {
      return;
    }

    fetchCourses();
  }, [provider]);


  const showModules = async() => {
    fetchCourseModules(selectedCourse);
    setShowTable(true)
    console.log("ContentCreatorCourseModules: Selected course ID: " + selectedCourse);
  };


  // Table
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [disable, setDisable] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const currDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(Date.now());
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

  const classes = useStyles();

  interface CourseModulesTableType {
    id: number;
    moduleName: string;
    moduleDesc: string;
    videoURL: ArrayBuffer;
    videoFilename: string;
    videoIpfsUrl: string;
    questionnaireURL: string;
    questionnaireFilename: string;
    questionnaireIpfsUrl: string;
    maxAttempts: number;
    rewardPrice: number;
    rewardsValidity: number;
    creationDate: string;
  }

  const [rows, setRows] = useState<CourseModulesTableType[]>([])

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

  const handleAdd = () => {
      setRows([
          ...rows,
          {
              id: rows.length + 1, moduleName: "", moduleDesc: "", videoURL: null, videoFilename: "",
              videoIpfsUrl: "", questionnaireURL: "", questionnaireFilename: "", questionnaireIpfsUrl: "",
              maxAttempts: 0, rewardPrice: 0, rewardsValidity: 0, creationDate: currDate
          },
      ]);
      setEdit(true);
  };

  const handleInputChange = (e, index) => {
      setDisable(false);
      const { name, value } = e.target;
      const list = [...rows];
      list[index][name] = value;
      setRows(list);
  };

  const handleConfirm = () => {
      setShowConfirm(true);
  };

  const handleRemoveClick = (i) => {
      const list = [...rows];
      list.splice(i, 1);
      setRows(list);
      setShowConfirm(false);
  };

  const handleNo = () => {
      setShowConfirm(false);
  };

  const handleEdit = (i) => {
      setEdit(!isEdit);
  };

  const [alertErrMessage, setAlertErrMessage] = useState("");

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
        } else if (row.videoURL == null) {
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
          //uploadToIPFS(row.questionnaireURL, row.questionnaireFilename, index, "json");
          uploadJsonToIPFS(row.questionnaireURL, row.questionnaireFilename, index);
          uploadVideoToIPFS(row.videoURL, row.videoFilename, index);
        });

        sqlTableEntry(rows)

        setEdit(!isEdit);
        setRows(rows);
        console.log("saved : ", rows);
        setDisable(true);
        setOpen(true);
      }
  };

  const sqlTableEntry = async(rows: CourseModulesTableType[]) => {

    // Content Creator course modules details entry
    rows.map(async (row, index) => {
      const counter = index + 1;
      console.log("ContentCreatorCourseModules: sqlTableEntry: Table entry: " + counter)

      const startTime = Math.floor(Date.now());
      const ccDetailsEntryResult = await ccCourseModulesTableEntry(provider, {
        ccCourseId: selectedCourse,
        moduleName: row.moduleName,
        moduleDescription: row.moduleDesc,
        videoURL: row.videoIpfsUrl,
        questionnaireURL: row.questionnaireIpfsUrl,
        maxAttempts: row.maxAttempts,
        rewardPrice: row.rewardPrice,
        rewardValidity: row.rewardsValidity
      });
      console.log("ContentCreatorCourseModules: sqlTableEntry: table entry result: " + ccDetailsEntryResult);
      const endTime = Math.floor(Date.now());
      console.log("ContentCreatorCourseModules: sqlTableEntry: Time to insert cc modules: " + (endTime - startTime));
    });
  }

  const [questFile, setQuestFile] = useState("");
  const [videoFile, setVideoFile] = useState(new ArrayBuffer(0));

  const renderFile = async (e, file: File, type: string) => {
    console.log("TestIPFS: renderFile: file: " + file.name)
    console.log("TestIPFS: renderFile: type: " + type)
    const reader = new FileReader();
    if (type == "json"){
      reader.readAsText(file);

      console.log("TestIPFS: renderFile: json onload: ")
      reader.onload = function (e) {
        console.log("TestIPFS: renderFile: json loaded: " + reader.result as string)
        setQuestFile(reader.result as string);
      }
    } else if (type == "video"){
      reader.readAsArrayBuffer(file);

      console.log("TestIPFS: renderFile: video onload: ")
      reader.onload = function (e) {
        console.log("TestIPFS: renderFile: video loaded: " + reader.result as string)
        setVideoFile(reader.result as ArrayBuffer);
      }
    }

    console.log("TestIPFS: renderFile: err: ")
    reader.onerror = function (error) {
      console.log('Error reading JSON file: ', error);
    };
  }

  const setValuesToRows = async (type: string, elementName: string, index: number, filename: string) => {
    const list = [...rows];
    if (type == "json") {
      list[index][elementName] = questFile;
      list[index]["questionnaireFilename"] = filename;
    } else if (type == "video") {
      list[index][elementName] = videoFile;
      list[index]["videoFilename"] = filename;
    }
    setRows(list); 
  }

  const handleObjectChange = async (e, type: string, index: number) => {
    setDisable(false);
    const { name, value } = e.target;
    const file = e.target.files[0];
    renderFile(e, file, type);
    setValuesToRows(type, name, index, file.name);
  }

  const uploadJsonToIPFS = async (file: string, filename: string, index: number) => {
    const fileObj = makeFileObject(file, filename);
    const cid = await storeWithProgress([fileObj], false);
    console.log("cid: " + cid)
    const fileURL = makeFileUrl(cid, filename);
    console.log("fileURL: " + fileURL)

    const list = [...rows];
    list[index]["questionnaireIpfsUrl"] = fileURL;
    setRows(list); 
  }

  const uploadVideoToIPFS = async (file: ArrayBuffer, filename: string, index: number) => {
    const fileObj = makeVideoObject(file, filename);
    const cid = await storeWithProgress([fileObj], false);
    console.log("cid: " + cid)
    const videFileURL = makeFileUrl(cid, filename);
    console.log("videFileURL: " + videFileURL)

    const list = [...rows];
    list[index]["videoIpfsUrl"] = videFileURL;
    setRows(list);
  }

  const fetchCourseModules = async (ccCourseId: number) => {
    // Get content creator course modules
    const startTime = Math.floor(Date.now());
    console.log("fetchCourseModules: ccCourseId: " + ccCourseId);
    const newCourseModules = await getContentCreatorCourseModules(provider, ccCourseId, wallet);
    const endTime = Math.floor(Date.now());
    console.log("ContentCreatorCourseModules: Time to get content creator course modules: " + (endTime - startTime));

    let newCourseModulesSize = newCourseModules !== null ? newCourseModules.rows.length : 0;
    console.log("ContentCreatorCourseModules: Set courses: " +  newCourseModulesSize);
    setCourseModules(newCourseModules);

    const tempRows: CourseModulesTableType[] = [];
    setRows([]);
    newCourseModules.rows.map((row, index) => {
      const tempRowObject: CourseModulesTableType = {id: 0, moduleName: "", moduleDesc: "", videoURL: null, videoFilename: "",
                                                    videoIpfsUrl: "", questionnaireURL: "", questionnaireFilename: "", questionnaireIpfsUrl: "",
                                                    maxAttempts: 0, rewardPrice: 0, rewardsValidity: 0, creationDate: ""};
      tempRowObject.id = index + 1;
      tempRowObject.moduleName = row[1];
      tempRowObject.moduleDesc = row[2];
      tempRowObject.videoURL = row[3];
      tempRowObject.questionnaireURL = row[4];
      tempRowObject.maxAttempts = row[5];
      tempRowObject.rewardPrice = row[6];
      tempRowObject.rewardsValidity = row[7];
      tempRowObject.creationDate = row[8];
      tempRows.push(tempRowObject);
    })
    newCourseModulesSize = tempRows !== null ? tempRows.length : 0;
    console.log("CourseModulesTable: Set courses: " +  newCourseModulesSize);
    setRows(tempRows);
}

  return (
    <ApexChartWrapper>
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>Course Modules</Typography>
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
            <Grid item xs={12} >
              <Box sx={{ display: 'flex', 
                          flexWrap: 'wrap',
                          alignItems: 'center'}}>
                <Box sx={{ mr: 2, mb: 1, width: 600, display: 'flex', flexDirection: 'column' }}>
                  <FormControl fullWidth>
                    <InputLabel variant="outlined">Select Course</InputLabel>
                    <Select label='Courses' onChange={(value) => setSelectedCourse(value.target.value as number)}>
                      {courses !== null && courses.rows.map((data) => {
                        return ((data[0] != -1) && 
                          <MenuItem value={data[0]}>{data[2]}</MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                </Box>
                <Button variant='contained' onClick={() => showModules()}>
                  Show Modules
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
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
                                        <input name="videoURL" hidden accept="video/*" 
                                          type="file" onChange={(e) => handleObjectChange(e, "video", i)} />
                                        <VideoVintage />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell padding="none">
                                      <IconButton color="primary" aria-label="upload json" component="label" >
                                        <input name="questionnaireURL" hidden accept="application/json" 
                                          type="file" onChange={(e) => handleObjectChange(e, "json", i)} />
                                        <CodeJson />
                                      </IconButton>
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
            </Grid>
        </Grid>
    </ApexChartWrapper>
  )
}

export default ContentCreatorCourseModules

// ** React Imports
import { useState } from 'react'

import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'



// ** MUI Imports
import CreateIcon from "@material-ui/icons/Create";
import {
    Box, Button, Snackbar, Table,
    TableBody, TableCell, TableHead, TableRow
} from "@mui/material";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
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
 
  // Creating style object
  const classes = useStyles();
  
  // Defining a state named rows
  // which we can update by calling on setRows function
  const [rows, setRows] = useState([
      { id: 1, firstname: "", lastname: "", city: "" },
  ]);

  // Initial states
  const [open, setOpen] = useState(false);
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

  // Function For adding new row object
  const handleAdd = () => {
      setRows([
          ...rows,
          {
              id: rows.length + 1, firstname: "",
              lastname: "", city: ""
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

  // Function to handle save
  const handleSave = () => {
      setEdit(!isEdit);
      setRows(rows);
      console.log("saved : ", rows);
      setDisable(true);
      setOpen(true);
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
            <Grid item xs={12}>
            <TableBody>
                <Snackbar
                  open={open}
                  autoHideDuration={2000}
                  onClose={handleClose}
                  className={classes.snackbar}
                >
                  <></>
                </Snackbar>
                <Box margin={1}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      {isEdit ? (
                        <div>
                          <Button onClick={handleAdd}>
                            <AddBoxIcon onClick={handleAdd} />
                            ADD
                          </Button>
                          {rows.length !== 0 && (
                            <div>
                              {disable ? (
                                <Button disabled variant="contained" onClick={handleSave}>
                                  <DoneIcon />
                                  SAVE
                                </Button>
                              ) : (
                                <Button variant="contained" onClick={handleSave}>
                                  <DoneIcon />
                                  SAVE
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Button onClick={handleAdd}>
                            <AddBoxIcon onClick={handleAdd} />
                            ADD
                          </Button>
                          <Button variant="contained" onClick={handleEdit}>
                            <CreateIcon />
                            EDIT
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <TableRow  />
            
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell align="center">City</TableCell>
                        <TableCell align="center"> </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, i) => {
                        return (
                          <div>
                            <TableRow>
                              {isEdit ? (
                                <div>
                                  <TableCell padding="none">
                                    <input
                                      value={row.firstname}
                                      name="firstname"
                                      onChange={(e) => handleInputChange(e, i)}
                                    />
                                  </TableCell>
                                  <TableCell padding="none">
                                    <input
                                      value={row.lastname}
                                      name="lastname"
                                      onChange={(e) => handleInputChange(e, i)}
                                    />
                                  </TableCell>
                                  <TableCell padding="none">
                                    <select
                                      style={{ width: "100px" }}
                                      name="city"
                                      value={row.city}
                                      onChange={(e) => handleInputChange(e, i)}
                                    >
                                      <option value=""></option>
                                      <option value="Karanja">Karanja</option>
                                      <option value="Hingoli">Hingoli</option>
                                      <option value="Bhandara">Bhandara</option>
                                      <option value="Amaravati">Amaravati</option>
                                      <option value="Pulgaon">Pulgaon</option>
                                    </select>
                                  </TableCell>
                                </div>
                              ) : (
                                <div>
                                  <TableCell component="th" scope="row">
                                    {row.firstname}
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {row.lastname}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="center">
                                    {row.city}
                                  </TableCell>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    align="center"
                                  ></TableCell>
                                </div>
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
                                <div>
                                  <Dialog
                                    open={showConfirm}
                                    onClose={handleNo}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                  >
                                    <DialogTitle id="alert-dialog-title">
                                      {"Confirm Delete"}
                                    </DialogTitle>
                                    <DialogContent>
                                      <DialogContentText id="alert-dialog-description">
                                        Are you sure to delete
                                      </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
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
                                    </DialogActions>
                                  </Dialog>
                                </div>
                              )}
                            </TableRow>
                          </div>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </TableBody>
            </Grid>
        </Grid>
    </ApexChartWrapper>
    
  )
}

export default CourseModulesTable

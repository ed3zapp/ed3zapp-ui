// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { useStore } from 'src/services/store'
import { useEffect, useState } from 'react'

// ** Icon Imports
import Video from 'mdi-material-ui/Video'
import CertificateOutline from 'mdi-material-ui/CertificateOutline'

interface RowType {
  age: number
  name: string
  date: string
  email: string
  salary: string
  status: string
  designation: string
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' },
  secondary: { color: 'secondary' }
}

const MAX_FETCH_RETRIES = 60; // max retries to fetch from provider when expecting a change
const FETCH_RETRY_TIMEOUT = 1000; // timeout between fetches when expecting a change

interface IProps {
  data: any;
}

const DashboardTable: React.FC<IProps> = ({ data }) => {
  const {
    state: { contract, wallet },
  } = useStore();

  const [courses, setCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);

  const fetchCourses = async (retry = false, retries = 0) => {
    const newCourses = await contract.fetchCourses();
    const completedCourses = await contract.fetchCompletedCourses();
    console.log("Fetch Courses Call.....");
    if (
      retry &&
      retries < MAX_FETCH_RETRIES &&
      courses.length === newCourses.length
    ) {
      return setTimeout(
        () => fetchCourses(true, retries + 1),
        FETCH_RETRY_TIMEOUT
      );
    }
    setCourses(newCourses);
    setCompletedCourses(completedCourses);
  };

  const getCourseStatus = async (courseID: number) => {
    return await contract.getCourseStatus(courseID);
  };

  const [userType, setUserType] = useState("");
  const fetchUserType = async () => {
    const result = await contract.getUserType(wallet);
    console.log("Usertype: " + result);
    setUserType(result);
  }

  //To fetch courses onload
  useEffect(() => {
    if (!contract) {
      return;
    }

    fetchUserType()
    fetchCourses();
  }, [contract]);

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Watch</TableCell>
              <TableCell>Bounty</TableCell>
              <TableCell>Cert</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((incompleteCourse) => ((incompleteCourse[0] != 0) &&
              <TableRow hover key={incompleteCourse[0]} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{incompleteCourse[0]}</TableCell>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{incompleteCourse[1]}</Typography>
                    <Typography variant='caption'>{incompleteCourse[2]}</Typography>
                  </Box>
                </TableCell>
                <TableCell><a href={incompleteCourse[4]} rel="noopener noreferrer" target="_blank"><Video /></a></TableCell>
                <TableCell>${incompleteCourse[5]}</TableCell>
                <TableCell> -- </TableCell>
                <TableCell>
                  <Chip
                    label={(userType=="1") ? "NA" : "Not Completed"}
                    color={(userType=="1") ? statusObj["secondary"].color : statusObj["rejected"].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {completedCourses.map((completedCourse) => ((completedCourse[0] != 0) &&
              <TableRow hover key={completedCourse[0]} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{completedCourse[0]}</TableCell>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{completedCourse[1]}</Typography>
                    <Typography variant='caption'>{completedCourse[2]}</Typography>
                  </Box>
                </TableCell>
                <TableCell><a href={completedCourse[4]} rel="noopener noreferrer" target="_blank"><Video sx={{ marginRight: 2, fontSize: '1.375rem' }} /></a></TableCell>
                <TableCell>${completedCourse[5]}</TableCell>
                <TableCell><a href="https://testnets.opensea.io/collection/nftport-xyz-v2?search[query]=KalviMilestoneNFT&amp;search[sortAscending]=true&amp;search[sortBy]=PRICE" 
                rel="noopener noreferrer" target="_blank"><CertificateOutline sx={{ marginRight: 2, fontSize: '1.375rem' }} /></a></TableCell>
                <TableCell>
                  <Chip
                    label={(userType=="1") ? "NA" : "Completed"}
                    color={(userType=="1") ? statusObj["secondary"].color : statusObj["professional"].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default DashboardTable

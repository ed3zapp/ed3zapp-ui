// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import { useCovalent } from "../services/hooks/useCovalent"
import { useEffect, useState } from "react"
import { application_properties } from '../configs/application-properties';

const [dataRows, setDataRows] = useState<any>([])

const { 
  getNFTTokenIdsForContract, 
  getNFTTransactionsForContract, 
  getNFTExternalMetadataForContract 
} = useCovalent();

useEffect(() => {
  const fetch = async () => {
    const tokenIds = await getNFTTokenIdsForContract(application_properties.contract_address)
    console.log('t', tokenIds)
    const txs = await getNFTTransactionsForContract(application_properties.contract_address, '3')
    console.log('s', txs)
    const metadata = await getNFTExternalMetadataForContract(application_properties.contract_address, "3")
    console.log('m', metadata)
    setDataRows(tokenIds.data.items)
  }
  fetch()
}, [])

const SponsorDashboard = () => {

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
            <TotalEarning />
        </Grid>
        <Grid item xs={12}>
          <Table data={dataRows} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default SponsorDashboard

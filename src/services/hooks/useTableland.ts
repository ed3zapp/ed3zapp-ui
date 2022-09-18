import {connect, ReadQueryResult, resultsToObjects } from  "@tableland/sdk"
import { Wallet, providers, ethers } from 'ethers'
import { UserType } from "../store"

export enum TABLE_TYPE {
  USERS = 1,
  LEARNERS = 2,
  CONTENT_CREATORS = 3,
}

// Table - users
export const TableName_Users = 'users_80001_1845' // Polygon
export type TableType_Users = {
  userAddress: string,
  userType: number
}

// Table - content_creators
export const TableName_ContentCreators = 'content_creators_80001_1846' // Polygon
export type TableType_ContentCreators = {
  userName: string,
  userAddress: string,
  userBio: string
}

// Table - learners
export const TableName_Learners = 'learners_80001_1847' // Polygon
export type TableType_Learners = {
  userName: string,
  userAddress: string,
  userBio: string
}
export let dbConnection = null;
export function useTableland() {

  // Delete all entries in all tables
  const testDeleteAllTableEntries = async (provider : ethers.providers.Web3Provider) => {
    let startTime = Math.floor(Date.now()); // in seconds
    let endTime = Math.floor(Date.now()); // in seconds
    const tableland = await getConnection(provider);

    startTime = Math.floor(Date.now());
    const queryResult1 = await tableland.write(`DELETE FROM ${TableName_Users};`);
    console.log("test queryResult1: " + validate_txhash(queryResult1.hash))
    endTime = Math.floor(Date.now());
    console.log("Time to delete " + TableName_Users + ": " + (endTime - startTime));

    startTime = Math.floor(Date.now());
    const queryResult2 = await tableland.write(`DELETE FROM ${TableName_ContentCreators};`);
    console.log("test queryResult2: " + validate_txhash(queryResult2.hash))
    endTime = Math.floor(Date.now());
    console.log("Time to delete " + TableName_ContentCreators + ": " + (endTime - startTime));

    startTime = Math.floor(Date.now());
    const queryResult3 = await tableland.write(`DELETE FROM ${TableName_Learners};`);
    console.log("test queryResult3: " + validate_txhash(queryResult3.hash))
    endTime = Math.floor(Date.now());
    console.log("Time to delete " + TableName_Learners + ": " + (endTime - startTime));

    return true
  }

  async function getConnection(provider : ethers.providers.Web3Provider) {
    if (dbConnection == null) {
      console.log("connection is null")
      const startTime = Math.floor(Date.now());
      dbConnection = connect({ network: "testnet", chain: "polygon-mumbai", signer: provider.getSigner() });
      const endTime = Math.floor(Date.now());
      console.log("Time to get connection: " + (endTime - startTime));
    }
      console.log("resuing connection")
      return dbConnection;
    }

  // New user type data entry
  const userTableEntry = async (provider : ethers.providers.Web3Provider, data: TableType_Users) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.write(`INSERT INTO ${TableName_Users} (userAddress, userType, creationDate) VALUES ('${data.userAddress}', ${data.userType}, datetime('now', 'localtime'));`);
    return validate_txhash(queryResult.hash)
  }

  // New content creator user details data entry
  const contentCreatorTableEntry = async (provider : ethers.providers.Web3Provider, data: TableType_ContentCreators) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.write(`INSERT INTO ${TableName_ContentCreators} (userName, userAddress, userBio, creationDate) VALUES ('${data.userName}', '${data.userAddress}', '${data.userBio}', datetime('now', 'localtime'));`);
    return validate_txhash(queryResult.hash)
  }

  // New learner user details data entry
  const learnerTableEntry = async (provider : ethers.providers.Web3Provider, data: TableType_Learners) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.write(`INSERT INTO ${TableName_Learners} (userName, userAddress, userBio, creationDate) VALUES ('${data.userName}', '${data.userAddress}', '${data.userBio}', datetime('now', 'localtime'));`);
    return validate_txhash(queryResult.hash)
  }

  // Check if user already exists
  const isUserExists = async (provider : ethers.providers.Web3Provider, address: string) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.read(`SELECT userType FROM ${TableName_Users} WHERE userAddress='${address}';`);

    console.log("qHash:" + queryResult.hash)
    console.log("queryResult.rows: " + queryResult.rows)
    console.log("queryResult.rows.length: " + queryResult.rows.length)
    console.log("isUserExists table contents: " + showTableValuesInConsole(queryResult))
    if (queryResult.rows.length > 0) {
      return true;
    }

    return false;
  }

  // Get content creator Id
  const getContentCreatorId = async (provider : ethers.providers.Web3Provider, address: string) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.read(`SELECT id FROM ${TableName_ContentCreators} WHERE userAddress='${address}';`);
    const entries = resultsToObjects(queryResult);

    if (entries.length == 1) {
      for (const { id } of entries) {
        return parseInt(id, 0);
      }
    }

    return 9999;
  }

  // Get user type
  const getUserType = async (provider : ethers.providers.Web3Provider, address: string) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.read(`SELECT userType FROM ${TableName_Users} WHERE userAddress='${address}';`);
    const entries = resultsToObjects(queryResult);

    console.log("getUserType table contents: " + showTableValuesInConsole(queryResult))
    if (entries.length == 1) {
      for (const { userType } of entries) {
        return parseInt(userType, 0);
      }
    }
    
    return UserType.UNENROLLED;
  }

  // Grants table access to new users
  const grantUserAccessToTable = async (provider : ethers.providers.Web3Provider, address: string, tableType: TABLE_TYPE) => {
    let tableName: string;
    try {
        if (tableType == TABLE_TYPE.USERS) {
          tableName = TableName_Users;
        } else if (tableType == TABLE_TYPE.LEARNERS) {
          tableName = TableName_Learners;
        } else if (tableType == TABLE_TYPE.CONTENT_CREATORS) {
          tableName = TableName_ContentCreators;
        }

        let startTime = Math.floor(Date.now()); // in seconds
        let endTime = Math.floor(Date.now()); // in seconds

        startTime = Math.floor(Date.now());
        const signer = new ethers.Wallet(process.env.ADMIN_DB_ACCOUNT_KEY, provider);
        endTime = Math.floor(Date.now());
        console.log("userTableLand: Time to create signer: " + (endTime - startTime));

        startTime = Math.floor(Date.now());
        const tableland = connect({ network: "testnet", chain: "polygon-mumbai", signer: signer });
        endTime = Math.floor(Date.now());
        console.log("userTableLand: Time to create connection: " + (endTime - startTime));

        startTime = Math.floor(Date.now());
        const queryResult = await tableland.write(`GRANT INSERT,UPDATE ON ${tableName} TO '${address}';`);
        console.log("Grant provided for new user: " + address + " for table: " + tableName)
        endTime = Math.floor(Date.now());
        console.log("userTableLand: Time to provide grant to users: " + (endTime - startTime));

        return validate_txhash(queryResult.hash)
    } catch (err) {
        console.log("Error providing table access for user: " + address + " : for table: " + tableName + " : " + err.message)
    }
    return false;
  }

  // Validate to check if transaction hash pattern is valid
  function validate_txhash(addr: string)
  {
    return /^0x([A-Fa-f0-9]{64})$/.test(addr);
  }

  // Validate to check if transaction hash pattern is valid
  function showTableValuesInConsole(queryResult: ReadQueryResult)
  {
    for (const [rowId, row] of Object.entries(queryResult.rows)) {
      console.log(`row: ${rowId}`);
      for (const [colId, data] of Object.entries(row)) {
        const { name } = queryResult.columns[colId];
        console.log(`  ${name}: ${data}`);
      }
    }
  }

  return { userTableEntry, 
            isUserExists, 
            grantUserAccessToTable,
            getUserType,
            contentCreatorTableEntry,
            learnerTableEntry,
            testDeleteAllTableEntries,
            getContentCreatorId
          }
}

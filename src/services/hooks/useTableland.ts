import {connect, ReadQueryResult, resultsToObjects } from  "@tableland/sdk"
import { ethers } from 'ethers'
import { UserType } from "../store"
import { format } from 'react-string-format';
import { db_sql_properties } from '../../configs/application-properties';
import { count } from "console";

export enum TABLE_TYPE {
  USERS = 1,
  LEARNERS = 2,
  CONTENT_CREATORS = 3,
  CC_COURSES = 4,
  CC_COURSE_MODULES = 5
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

// Table - cc_courses
export const TableName_CC_Courses = 'cc_courses_80001_2665' // Polygon
export type TableType_CC_Courses = {
  ccId: number,
  courseName: string,
  courseDescription: string,
  topic: string,
  price: number,
  rewards: number
}

// Table - cc_modules
export const TableName_CC_Course_Modules = 'cc_modules_80001_2840' // Polygon
export type TableType_CC_Course_Modules = {
  ccCourseId: number,
  moduleName: string,
  moduleDescription: string,
  videoURL: string,
  questionnaireURL: string,
  maxAttempts: number,
  rewardPrice: number,
  rewardValidity: number
}

export let dbConnection = null;
export function useTableland() {

  // Delete all entries in all tables
  const testDeleteAllTableEntries = async (provider : ethers.providers.Web3Provider) => {
    let startTime = Math.floor(Date.now()); // in seconds
    let endTime = Math.floor(Date.now()); // in seconds
    const tableland = await getConnection(provider);

    startTime = Math.floor(Date.now());
    const queryResult1 = await tableland.write(format(db_sql_properties.sql_delete_entries, TableName_Users),
                          { skipConfirm: true });

    console.log("test queryResult1: " + validate_txhash(queryResult1.hash))
    endTime = Math.floor(Date.now());
    console.log("Time to delete " + TableName_Users + ": " + (endTime - startTime));

    startTime = Math.floor(Date.now());
    const queryResult2 = await tableland.write(format(db_sql_properties.sql_delete_entries, TableName_ContentCreators),
                          { skipConfirm: true });      
    console.log("test queryResult2: " + validate_txhash(queryResult2.hash))
    endTime = Math.floor(Date.now());
    console.log("Time to delete " + TableName_ContentCreators + ": " + (endTime - startTime));

    startTime = Math.floor(Date.now());
    const queryResult3 = await tableland.write(format(db_sql_properties.sql_delete_entries, TableName_Learners),
                          { skipConfirm: true });
    console.log("test queryResult3: " + validate_txhash(queryResult3.hash))
    endTime = Math.floor(Date.now());
    console.log("Time to delete " + TableName_Learners + ": " + (endTime - startTime));

    startTime = Math.floor(Date.now());
    const queryResult4 = await tableland.write(format(db_sql_properties.sql_delete_entries, TableName_CC_Courses),
                          { skipConfirm: true });
    console.log("test queryResult4: " + validate_txhash(queryResult4.hash))
    endTime = Math.floor(Date.now());
    console.log("Time to delete " + TableName_Learners + ": " + (endTime - startTime));

    startTime = Math.floor(Date.now());
    const queryResult5 = await tableland.write(format(db_sql_properties.sql_delete_entries, TableName_CC_Course_Modules),
                          { skipConfirm: true });
    console.log("test queryResult5: " + validate_txhash(queryResult5.hash))
    endTime = Math.floor(Date.now());
    console.log("Time to delete " + TableName_Learners + ": " + (endTime - startTime));

    return true
  }

  async function getConnection(provider : ethers.providers.Web3Provider) {
    if (dbConnection == null) {
      console.log("Initializing tableland connection...")
      const startTime = Math.floor(Date.now());
      dbConnection = connect({ network: "testnet", chain: "polygon-mumbai", signer: provider.getSigner() });
      const endTime = Math.floor(Date.now());
      console.log("Time to get tableland connection: " + (endTime - startTime));
    }
      console.log("Reusing tableland connection")
      return dbConnection;
    }

  // New user type data entry
  const userTableEntry = async (provider : ethers.providers.Web3Provider, data: TableType_Users) => {
    const tableland = await getConnection(provider);
    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.write(format(db_sql_properties.sql_user_table_entries, TableName_Users, 
                          data.userAddress, data.userType),
                          { skipConfirm: true });
    let endTime = Math.floor(Date.now());
    console.log("userTableLand: entry time: " + (endTime - startTime));

    return validate_txhash(queryResult.hash)
  }

  // New content creator user details data entry
  const contentCreatorTableEntry = async (provider : ethers.providers.Web3Provider, data: TableType_ContentCreators) => {
    const tableland = await getConnection(provider);
    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.write(format(db_sql_properties.sql_cc_table_entries, TableName_ContentCreators, 
                          data.userName, data.userAddress, data.userBio),
                          { skipConfirm: true });
    let endTime = Math.floor(Date.now());
    console.log("userTableLand: contentCreatorTableEntry: entry time: " + (endTime - startTime));

    return validate_txhash(queryResult.hash)
  }

  // New learner user details data entry
  const learnerTableEntry = async (provider : ethers.providers.Web3Provider, data: TableType_Learners) => {
    const tableland = await getConnection(provider);
    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.write(format(db_sql_properties.sql_learners_table_entries, TableName_Learners, 
                          data.userName, data.userAddress, data.userBio),
                          { skipConfirm: true });

    let endTime = Math.floor(Date.now());
    console.log("userTableLand: learnerTableEntry: entry time: " + (endTime - startTime));

    return validate_txhash(queryResult.hash)
  }

  // Content creator courses data entry
  const ccCoursesTableEntry = async (provider : ethers.providers.Web3Provider, data: TableType_CC_Courses) => {
    const tableland = await getConnection(provider);
    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.write(format(db_sql_properties.sql_cc_courses_table_entries, TableName_CC_Courses, 
                          data.ccId, data.courseName, data.courseDescription, data.topic, data.price, data.rewards),
                          { skipConfirm: true });

    let endTime = Math.floor(Date.now());
    console.log("userTableLand: ccCoursesTableEntry: entry time: " + (endTime - startTime));

    return validate_txhash(queryResult.hash)
  }

  // Content creator course modules data entry
  const ccCourseModulesTableEntry = async (provider : ethers.providers.Web3Provider, data: TableType_CC_Course_Modules) => {
    const tableland = await getConnection(provider);
    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.write(format(db_sql_properties.sql_cc_course_modules_table_entries, TableName_CC_Course_Modules, 
                          data.ccCourseId, data.moduleName, data.moduleDescription, data.videoURL, data.questionnaireURL, 
                          data.maxAttempts, data.rewardPrice, data.rewardValidity),
                          { skipConfirm: true });

    let endTime = Math.floor(Date.now());
    console.log("userTableLand: ccCourseModulesTableEntry: entry time: " + (endTime - startTime));

    return validate_txhash(queryResult.hash)
  }

  // Get content creator courses
  const getContentCreatorCourses = async (provider : ethers.providers.Web3Provider, address: string) => {
    const tableland = await getConnection(provider);
    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.read(format(db_sql_properties.sql_get_cc_courses, TableName_Users, 
                                              TableName_ContentCreators, TableName_CC_Courses, address ));
    let endTime = Math.floor(Date.now());
    console.log("userTableLand: getContentCreatorCourses: entry time: " + (endTime - startTime));

    return queryResult
  }

  // Get content creator course modules
  const getContentCreatorCourseModules = async (provider : ethers.providers.Web3Provider, couserId: number, address: string) => {
    const tableland = await getConnection(provider);
    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.read(format(db_sql_properties.sql_get_cc_course_modules, TableName_Users, TableName_ContentCreators, 
                                              TableName_CC_Courses, TableName_CC_Course_Modules, couserId, address));

    let endTime = Math.floor(Date.now());
    console.log("userTableLand: getContentCreatorCourseModules: entry time: " + (endTime - startTime));

    return queryResult
  }

  // UpdateTest
  const updateTest = async (provider : ethers.providers.Web3Provider) => {
    const tableland = await getConnection(provider);
    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.write(`UPDATE ${TableName_ContentCreators} SET userName='ContentCreatorRam' WHERE userAddress='0x89A17440742943FE46dfa1894033D32F3B61e515';`,
                          { skipConfirm: true });

    let endTime = Math.floor(Date.now());
    console.log("updateTest: update time: " + (endTime - startTime));

    return validate_txhash(queryResult.hash)
  }

  // Check if user already exists
  const isUserExists = async (provider : ethers.providers.Web3Provider, address: string) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.read(format(db_sql_properties.sql_get_user_type, TableName_Users, address));

    if (queryResult.rows.length > 0) {
      console.log("isUserExists table contents: " + showTableValuesInConsole(queryResult))
      return true;
    }

    return false;
  }

  // Get content creator Id
  const getContentCreatorId = async (provider : ethers.providers.Web3Provider, address: string) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.read(format(db_sql_properties.sql_get_cc_id, TableName_ContentCreators, address));
    const entries = resultsToObjects(queryResult);

    if (entries.length == 1) {
      for (const { id } of entries) {
        return parseInt(id, 0);
      }
    }

    return 0;
  }

  // Get user type
  const getUserType = async (provider : ethers.providers.Web3Provider, address: string) => {
    const tableland = await getConnection(provider);
    const queryResult = await tableland.read(format(db_sql_properties.sql_get_user_type, TableName_Users, address));
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
        } else if (tableType == TABLE_TYPE.CC_COURSES) {
          tableName = TableName_CC_Courses;
        } else if (tableType == TABLE_TYPE.CC_COURSE_MODULES) {
          tableName = TableName_CC_Course_Modules;
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
        const queryResult = await tableland.write(format(db_sql_properties.sql_grant_access, tableName, address),
                            { skipConfirm: true });
        console.log("Grant provided for new user: " + address + " for table: " + tableName)
        endTime = Math.floor(Date.now());
        console.log("userTableLand: Time to provide grant to users: " + (endTime - startTime));
        console.log("userTableLand: HASH: " + (queryResult.hash));

        return validate_txhash(queryResult.hash)
    } catch (err) {
        console.log("Error providing table access for user: " + address + " : for table: " + tableName + " : " + err.message)
    }
    return false;
  }

  const createTableTest = async (provider : ethers.providers.Web3Provider) => {
    const tableland = await getConnection(provider);

    let startTime = Math.floor(Date.now());
    const queryResult = await tableland.create(`id INTEGER PRIMARY KEY, ccCourseId INTEGER, name TEXT, description TEXT, videoURL TEXT, questionnaireURL TEXT, maxAttempts INTEGER, rewardPrice INTEGER, rewardValidity INTEGER, creationDate TEXT`, {
      prefix: `cc_modules`
    }); 
    let endTime = Math.floor(Date.now());
    console.log("createTableTest: Time to create table: " + (endTime - startTime));
    return queryResult;
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
            getContentCreatorId,
            ccCoursesTableEntry,
            getContentCreatorCourses,
            ccCourseModulesTableEntry,
            getContentCreatorCourseModules,
            updateTest,
            createTableTest
          }
}

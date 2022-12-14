import { ethers, Contract } from "ethers";
import React from "react";

import USER_ABI from "../configs/abis/App.json";
import { useTableland } from "./hooks/useTableland";

import { application_properties } from '../configs/application-properties';

export enum UserType {
  CONTENT_CREATOR = 1,
  LEARNER = 2,
  UNENROLLED = 3,
}

export enum StoreAction {
  LOGIN,
  LOGOUT,
}

export interface IStoreAction {
  type: StoreAction;
  payload?: Partial<IStoreState>;
}

interface IStoreState {
  loggedIn: boolean;
  wallet?: string;
  provider?: ethers.providers.Web3Provider;
  userType?: UserType;
  contract?: Contract;
  logout?: () => void;
}

type IStoreDispatch = (action: IStoreAction) => void;

const StoreContext = React.createContext<
  { state: IStoreState; dispatch?: IStoreDispatch } | undefined
>(undefined);

function storeReducer(state: IStoreState, action: IStoreAction): IStoreState {
  switch (action.type) {
    case StoreAction.LOGIN: {
      return {
        ...state,
        loggedIn: true,
        ...action.payload,
      };
    }
    case StoreAction.LOGOUT: {
      return { loggedIn: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function StoreProvider({ children }) {
  const [state, dispatch] = React.useReducer(storeReducer, { loggedIn: false });

  const value = { state, dispatch };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

function useStore() {
  const context = React.useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
}

async function loginUser(
  provider: ethers.providers.Web3Provider,
  logout: () => void,
  dispatch: IStoreDispatch
) {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const wallet = String(address);

  const contract = new ethers.Contract(application_properties.contract_address, USER_ABI.abi, signer);
  let userType = UserType.UNENROLLED;
  let startTime = Math.floor(Date.now()); // in seconds
  let endTime = Math.floor(Date.now()); // in seconds

  // Test- Delete all entries 
  //startTime = Math.floor(Date.now());
  //const { testDeleteAllTableEntries } = useTableland();
  //await testDeleteAllTableEntries(provider);
  //endTime = Math.floor(Date.now());
  //console.log("Total time to delete tables: " + (endTime - startTime));
  //console.log("Test delete done!")

  // Test- Create table
  //const { createTableTest } = useTableland();
  //const createQueryResult = await createTableTest(provider);
  //console.log("Test create done: " + createQueryResult)

  // Check if user is already registered user
  startTime = Math.floor(Date.now());
  const { isUserExists, getUserType } = useTableland();
  const isUserExist = await isUserExists(provider, wallet);
  endTime = Math.floor(Date.now());
  console.log("Time to check if user exists: " + (endTime - startTime));

  if (isUserExist) {
    // Fetch userType
    console.log("User already exists: " + wallet)
    startTime = Math.floor(Date.now());
    userType = await getUserType(provider, wallet);
    endTime = Math.floor(Date.now());
    console.log("Time to get user type: " + (endTime - startTime));
  }

  console.log("comes here9")
  dispatch({
    type: StoreAction.LOGIN,
    payload: { wallet, provider, contract, userType, logout },
  });
}

export { StoreProvider, useStore, loginUser };

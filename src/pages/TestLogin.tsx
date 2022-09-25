import React from "react";
import Button from "@mui/material/Button";
import { loginUser, StoreAction, useStore } from "../services/store";
import { CircularProgress } from "@mui/material";
import { ethers } from "ethers";


declare const window: any

const Login: React.FC = () => {
  const store = useStore();

  async function connectMetamaskWallet(): Promise<void> {
    //to get around type checking
    (window as any).ethereum
      .request({
          method: "eth_requestAccounts",
      })
      .then((accounts : string[]) => {
        console.log(accounts[0]);
      })
      .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
      });

      console.log("before loginUser");
      loginUser(new ethers.providers.Web3Provider(window.ethereum), logout, store.dispatch);
  }

  const logout = () => {
    try {
      handleLogout();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    store.dispatch({ type: StoreAction.LOGOUT });
    window.location.replace("/");
  };

  return store.state.loggedIn ? (
    <>
        <CircularProgress />
    </>
  ) : (
    <Button variant="contained" onClick={connectMetamaskWallet}>Connect</Button>
  );
};

export default Login;

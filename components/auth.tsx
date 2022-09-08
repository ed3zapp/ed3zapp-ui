import { useEffect } from "react";
import { ethers } from "ethers";
import { loginUser, StoreAction, useStore, UserType } from "../services/store";
import Web3Auth from "../services/web3auth";
import { useRouter } from "next/router";

const Auth: React.FC = () => {
  const store = useStore();
  const router = useRouter();

  const handleLogin = async (data) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        Web3Auth.web3auth.provider
      );
      loginUser(provider, logout, store.dispatch);
    } catch (error) {
      logout();
    }
  };

  const logout = () => {
    try {
      Web3Auth.logout();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    store.dispatch({ type: StoreAction.LOGOUT });
    window.location.replace("/");
  };

  useEffect(() => {
    const init = async () => {
      try {
        await Web3Auth.initializeModal(handleLogin, handleLogout);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!store.state.loggedIn) {
      router.push("/");
    }

    switch (store.state.userType) {
      case UserType.UNENROLLED:
        router.push("/enroll");
        break;
      case UserType.SPONSOR:
        router.push("/sponsor");
        break;
      case UserType.LEARNER:
        router.push("/learner");
        break;
      default:
        logout();
        return;
    }
  }, [store.state.userType]);

  return <></>;
};

export default Auth;

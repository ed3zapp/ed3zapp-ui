import { useEffect } from "react";
import { useStore, UserType } from "../services/store";
import { useRouter } from "next/router";

const Auth: React.FC = () => {
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!store.state.loggedIn) {
      router.push("/");
    }

    switch (store.state.userType) {
      case UserType.UNENROLLED:
        router.push("/chooseRole");
        break;
      case UserType.CONTENT_CREATOR:
        router.push("/ccTest");
        break;
      case UserType.LEARNER:
        router.push("/learnerTest");
        break;
    }
  }, [store.state.userType]);

  return <></>;
};

export default Auth;

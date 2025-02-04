import { useContext } from "react";
import { UserInfoContext } from "../components/userInfo/UserInfoProvider";

const useUserInfo = () => {
  const {
    displayedUser,
    currentUser,
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
    authToken,
  } = useContext(UserInfoContext);

  return {
    displayedUser,
    currentUser,
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
    authToken,
  };
};

export default useUserInfo;

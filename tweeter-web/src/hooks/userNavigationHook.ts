import { useContext } from "react";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { UserInfoContext } from "../components/userInfo/UserInfoProvider";
import useToastListener from "../components/toaster/ToastListenerHook";

const useUserNavigation = () => {
  const { displayErrorMessage } = useToastListener();

  const { currentUser, displayedUser, setDisplayedUser, authToken } =
    useContext(UserInfoContext);

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const user = await getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return { navigateToUser };
};

export default useUserNavigation;

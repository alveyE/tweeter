import { useContext, useState } from "react";
import { UserInfoContext } from "../components/userInfo/UserInfoProvider";
import useToastListener from "../components/toaster/ToastListenerHook";
import { UserNavigationPresenter } from "../presenters/UserNavigationPresenter";

const useUserNavigation = () => {
  const { displayErrorMessage } = useToastListener();

  const { currentUser, displayedUser, setDisplayedUser, authToken } =
    useContext(UserInfoContext);

  const [presenter] = useState(new UserNavigationPresenter());

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const user = await presenter.getUser(authToken!, alias);

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

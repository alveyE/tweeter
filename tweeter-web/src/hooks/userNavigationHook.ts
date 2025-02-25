import { useContext, useState } from "react";
import { UserInfoContext } from "../components/userInfo/UserInfoProvider";
import useToastListener from "../components/toaster/ToastListenerHook";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../presenters/UserNavigationPresenter";

const useUserNavigation = () => {
  const { displayErrorMessage } = useToastListener();

  const { currentUser, displayedUser, setDisplayedUser, authToken } =
    useContext(UserInfoContext);

  const listener: UserNavigationView = {
    displayErrorMessage,
  };

  const [presenter] = useState(new UserNavigationPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    const user = await presenter.navigateToUser(event, authToken!);

    if (!!user) {
      if (currentUser!.equals(user)) {
        setDisplayedUser(currentUser!);
      } else {
        setDisplayedUser(user);
      }
    }
  };

  return { navigateToUser };
};

export default useUserNavigation;

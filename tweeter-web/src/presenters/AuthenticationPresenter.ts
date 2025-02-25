import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ): void;
  navigate(path: string): void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
  protected userService: UserService;

  public constructor(view: AuthenticationView) {
    super(view);
    this.userService = new UserService();
  }

  protected navigateTo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
    path: string | undefined
  ): void {
    this.view.updateUserInfo(currentUser, displayedUser, authToken, remember);

    if (!!path) {
      this.view.navigate(path);
    } else {
      this.view.navigate("/");
    }
  }
}

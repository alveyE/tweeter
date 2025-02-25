import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
  public constructor(view: AuthenticationView) {
    super(view);
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> {
    try {
      const [user, authToken] = await this.userService.login(alias, password);

      this.updateUserInfo(user, user, authToken, rememberMe);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  }

  public updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ): void {
    this.view.updateUserInfo(currentUser, displayedUser, authToken, remember);
  }
}

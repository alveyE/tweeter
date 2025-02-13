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
    password: string
  ): Promise<[User, AuthToken]> {
    const [user, authToken] = await this.userService.login(alias, password);
    return [user, authToken];
  }

  public updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ): void {
    this._view.updateUserInfo(currentUser, displayedUser, authToken, remember);
  }
}

import { AuthToken, User } from "tweeter-shared";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const [user, authToken] = await this.userService.login(alias, password);

      this.updateUserInfo(user, user, authToken, rememberMe);
    }, "log user in");
  }
}

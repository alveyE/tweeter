import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface NavbarView extends MessageView {
  clearUserInfo(): void;
}

export class NavbarPresenter extends Presenter<NavbarView> {
  private _userService: UserService | null = null;

  constructor(view: NavbarView) {
    super(view);
  }

  public get userService(): UserService {
    if (this._userService === null) {
      this._userService = new UserService();
    }
    return new UserService();
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}

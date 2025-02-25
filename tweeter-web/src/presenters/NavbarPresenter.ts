import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface NavbarView extends MessageView {
  clearUserInfo(): void;
}

export class NavbarPresenter extends Presenter<NavbarView> {
  private userService: UserService;

  constructor(view: NavbarView) {
    super(view);
    this.userService = new UserService();
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(authToken);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}

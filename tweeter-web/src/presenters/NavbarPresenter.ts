import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface NavbarView {
  displayErrorMessage(message: string): void;
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
}

export class NavbarPresenter {
  private view: NavbarView;
  private userService: UserService;

  constructor(view: NavbarView) {
    this.view = view;
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

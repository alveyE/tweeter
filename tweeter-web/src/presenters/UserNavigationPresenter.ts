import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class UserNavigationPresenter {
  private userService: UserService;

  public constructor() {
    this.userService = new UserService();
  }

  public async getUser(authToken: AuthToken, alias: string) {
    return await this.userService.getUser(authToken, alias);
  }
}

import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this.userService = new UserService();
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken
  ): Promise<User | null> {
    let user: User | null = null;
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      user = await this.userService.getUser(authToken, alias);
    }, "get user");
    return user;
  }
}

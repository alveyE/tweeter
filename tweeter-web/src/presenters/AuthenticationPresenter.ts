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
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
  protected userService: UserService;

  protected constructor(view: AuthenticationView) {
    super(view);
    this.userService = new UserService();
  }

  public abstract updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ): void;
}

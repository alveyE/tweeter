import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AuthenticationView {
  updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ): void;
}

export abstract class AuthenticationPresenter {
  protected _view: AuthenticationView;
  protected userService: UserService;

  protected constructor(view: AuthenticationView) {
    this._view = view;
    this.userService = new UserService();
  }

  public abstract updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ): void;
}

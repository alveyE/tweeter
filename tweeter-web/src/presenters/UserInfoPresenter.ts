import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { ToastListener } from "../components/toaster/ToastListenerHook";

export interface UserInfoView {
  toastListener: ToastListener;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private userService: UserService;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.userService = new UserService();
  }

  private _isFollower = false;
  private _followeeCount = -1;
  private _followerCount = -1;

  public get isFollower(): boolean {
    return this._isFollower;
  }

  public get followeeCount(): number {
    return this._followeeCount;
  }

  public get followerCount(): number {
    return this._followerCount;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._isFollower = false;
      } else {
        this._isFollower = await this.userService.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    } catch (error) {
      this.view.toastListener.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this._followeeCount = await this.userService.getFolloweeCount(
        authToken,
        displayedUser
      );
    } catch (error) {
      this.view.toastListener.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this._followerCount = await this.userService.getFollowerCount(
        authToken,
        displayedUser
      );
    } catch (error) {
      this.view.toastListener.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      this.view.toastListener.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.userService.follow(
        authToken!,
        displayedUser!
      );

      this._isFollower = true;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    } catch (error) {
      this.view.toastListener.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.toastListener.clearLastInfoMessage();
    }
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      this.view.toastListener.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.userService.unfollow(
        authToken!,
        displayedUser!
      );

      this._isFollower = false;
      this._followerCount = followerCount;
      this._followeeCount = followeeCount;
    } catch (error) {
      this.view.toastListener.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.toastListener.clearLastInfoMessage();
    }
  }
}

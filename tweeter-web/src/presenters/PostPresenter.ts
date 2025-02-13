import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export class PostPresenter {
  private postService: StatusService;

  private _isLoading = false;

  public constructor() {
    this.postService = new StatusService();
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  public async submitPost(
    currentUser: User,
    authToken: AuthToken,
    post: string
  ) {
    this.isLoading = true;
    const status = new Status(post, currentUser, Date.now());
    await this.postService.postStatus(authToken, status);
    this.isLoading = false;
  }
}

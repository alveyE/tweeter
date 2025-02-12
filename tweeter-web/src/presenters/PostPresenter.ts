import { AuthToken, Status, User } from "tweeter-shared";
import { PostService } from "../model/service/PostService";

export class PostPresenter {
  private postService: PostService;

  private _isLoading = false;

  public constructor() {
    this.postService = new PostService();
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

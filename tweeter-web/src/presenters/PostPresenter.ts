import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostView extends MessageView {
  onPostSuccess(): void;
}

export class PostPresenter extends Presenter<PostView> {
  private _postService: StatusService | null = null;

  private _isLoading = false;

  public constructor(view: PostView) {
    super(view);
  }

  public get postService(): StatusService {
    if (this._postService === null) {
      this._postService = new StatusService();
    }
    return this._postService;
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
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);

      this._isLoading = true;
      const status = new Status(post, currentUser, Date.now());

      await this.postService.postStatus(authToken, status);
      this.view.displayInfoMessage("Status posted successfully!", 2000);
      this.view.onPostSuccess();
    }, "post the status");
    this._isLoading = false;
    this.view.clearLastInfoMessage();
  }
}

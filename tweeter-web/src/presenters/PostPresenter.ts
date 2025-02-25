import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostView extends MessageView {}

export class PostPresenter extends Presenter<PostView> {
  private postService: StatusService;

  private _isLoading = false;

  public constructor(view: PostView) {
    super(view);
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
    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);
      this.isLoading = true;
      const status = new Status(post, currentUser, Date.now());
      await this.postService.postStatus(authToken, status);
      this.view.displayInfoMessage("Status posted successfully!", 2000);
    }, "post the status");
    this.isLoading = false;
    this.view.clearLastInfoMessage();
  }
}

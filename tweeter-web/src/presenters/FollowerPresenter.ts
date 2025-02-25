import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemView, UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    const [newItems, hasMore] = await this.service.loadMoreFollowers(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
    return [newItems, hasMore];
  }
  protected getItemDescription(): string {
    return "load followers";
  }

  protected createService(): FollowService {
    return new FollowService();
  }
}

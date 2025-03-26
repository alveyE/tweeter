import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return await this.serverFacade.getMoreFollows(
      {
        token: authToken.token,
        userAlias,
        pageSize,
        lastItem: lastItem ? lastItem.dto : null,
      },
      "/follower/list"
    );
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return await this.serverFacade.getMoreFollows(
      {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem ? lastItem.dto : null,
      },
      "/followee/list"
    );
  }
}

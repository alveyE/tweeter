import { AuthToken, FakeData, Status } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await this.serverFacade.getMoreStatusItems(
      {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem ? lastItem.dto : null,
      },
      "/status/loadFeed"
    );
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await this.serverFacade.getMoreStatusItems(
      {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem ? lastItem.dto : null,
      },
      "/status/loadStory"
    );
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await this.serverFacade.postStatus({
      token: authToken.token,
      status: newStatus,
    });
  }
}

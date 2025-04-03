import { StatusDto, User } from "tweeter-shared";
import { FollowsDynamoDBDao } from "../dao/dao-classes/FollowsDynamoDB";
import { StatusDynamoDBDao } from "../dao/dao-classes/StatusDynamoDB";
import { StatusEntity } from "../entities/StatusEntity";
import { UserDynamoDBDao } from "../dao/dao-classes/UserDynamoDB";
import { Service } from "./Service";
import { StatusDAO } from "../dao/StatusDAO";
import { UserDao } from "../dao/UserDAO";
import { FollowsDao } from "../dao/FollowsDAO";

export class StatusService extends Service {
  private statusDao: StatusDAO;
  private userDao: UserDao;
  private followsDao: FollowsDao;

  constructor() {
    super();
    this.statusDao = new StatusDynamoDBDao();
    this.userDao = new UserDynamoDBDao();
    this.followsDao = new FollowsDynamoDBDao();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.ensureTokenValid(token);

    let page = await this.statusDao.getPageOfFeed(
      userAlias,
      pageSize,
      lastItem ? lastItem.timestamp : undefined
    );
    const dtos = await Promise.all(
      page.values.map(async (status) => await this.dtoFromEntity(status))
    );
    return [
      dtos.filter((dto): dto is StatusDto => dto !== null),
      page.hasMorePages,
    ];

    // TODO: Replace with the result of calling server
    //return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.ensureTokenValid(token);

    let page = await this.statusDao.getPageOfStory(
      userAlias,
      pageSize,
      lastItem ? lastItem.timestamp : undefined
    );
    const dtos = await Promise.all(
      page.values.map(async (status) => await this.dtoFromEntity(status))
    );
    return [
      dtos.filter((dto): dto is StatusDto => dto !== null),
      page.hasMorePages,
    ];

    // TODO: Replace with the result of calling server
    //return this.getFakeData(lastItem, pageSize);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.ensureTokenValid(token);
    const statusEntity: StatusEntity = {
      userHandle: newStatus.user.alias,
      status: newStatus.post,
      timestamp: Date.now(),
    };
    this.statusDao.putInStory(statusEntity);

    let lastHandle: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      let page = await this.followsDao.getPageOfFollowers(
        newStatus.user.alias,
        10,
        lastHandle
      );
      for (const follower of page.values) {
        const followerAlias = follower.followerHandle;
        await this.statusDao.putInFeed(followerAlias, statusEntity);
      }
      if (page.values.length > 0) {
        lastHandle = page.values[page.values.length - 1].followerHandle;
      } else {
        hasMore = false;
      }
    }
  }

  public async dtoFromEntity(
    entity: StatusEntity | null
  ): Promise<StatusDto | null> {
    if (!entity) {
      return null;
    }
    const userEntity = await this.userDao.getUser(entity.userHandle);
    if (userEntity == null) {
      return null;
    }
    const user = new User(
      userEntity.firstName,
      userEntity.lastName,
      userEntity.alias,
      userEntity.imageUrl
    );

    return {
      post: entity.status,
      user: user.dto,
      timestamp: entity.timestamp,
      segments: [],
    };
  }
}

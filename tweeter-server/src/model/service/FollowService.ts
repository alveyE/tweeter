import { FakeData, User, UserDto } from "tweeter-shared";
import { FollowsDynamoDBDao } from "../dao/dao-classes/FollowsDynamoDB";
import { UserDynamoDBDao } from "../dao/dao-classes/UserDynamoDB";
import { Service } from "./Service";
import { Follower } from "../entities/Follower";

export class FollowService extends Service {
  private followsDao: FollowsDynamoDBDao;
  private userDao: UserDynamoDBDao;

  constructor() {
    super();
    this.followsDao = new FollowsDynamoDBDao();
    this.userDao = new UserDynamoDBDao();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    this.ensureTokenValid(token);

    let page = await this.followsDao.getPageOfFollowers(
      userAlias,
      pageSize,
      lastItem?.alias
    );

    const dtos = await Promise.all(
      page.values.map(async (user) => await this.dtoFromFollowerEntity(user))
    );
    return [
      dtos.filter((dto): dto is UserDto => dto !== null),
      page.hasMorePages,
    ];

    // TODO: Replace with the result of calling server
    //return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    this.ensureTokenValid(token);
    let page = await this.followsDao.getPageOfFollowees(
      userAlias,
      pageSize,
      lastItem?.alias
    );
    const dtos = await Promise.all(
      page.values.map(async (user) => await this.dtoFromFolloweeEntity(user))
    );
    return [
      dtos.filter((dto): dto is UserDto => dto !== null),
      page.hasMorePages,
    ];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    this.ensureTokenValid(token);

    const newEntity: Follower = {
      followerHandle: user.alias,
      followeeHandle: selectedUser.alias,
      followerName: user.firstName,
      followeeName: selectedUser.firstName,
    };
    const entity = await this.followsDao.getFollower(newEntity);
    if (entity === null || entity === undefined) {
      return false;
    }
    return true;
    // TODO: Replace with the result of calling server
    //return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    this.ensureTokenValid(token);
    const count = await this.userDao.getFolloweeCount(user.alias);
    if (count === null || count === undefined) {
      console.log("user get returned undefined");
      return 0;
    }
    return count;

    // TODO: Replace with the result of calling server
    // return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    this.ensureTokenValid(token);
    const count = await this.userDao.getFollowerCount(user.alias);
    if (count === null || count === undefined) {
      console.log("user get returned undefined");
      return 0;
    }
    return count;
    // TODO: Replace with the result of calling server
    //return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    this.ensureTokenValid(token);
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);
    await this.userDao.updateCounts(
      userToFollow.alias,
      followeeCount,
      followerCount + 1
    );

    const followerAlias = (await this.authTokenDao.getAuthToken(token))?.alias;
    if (followerAlias === null || followerAlias === undefined) {
      throw new Error("Invalid token");
    }
    const followerUser = await this.userDao.getUser(followerAlias);
    if (followerUser === null || followerUser === undefined) {
      throw new Error("Invalid user");
    }
    const actedFollowerCount = await this.getFollowerCount(token, followerUser);
    const actedFolloweeCount = await this.getFolloweeCount(token, followerUser);
    await this.userDao.updateCounts(
      followerAlias,
      actedFolloweeCount + 1,
      actedFollowerCount
    );
    const updatedFollow: Follower = {
      followerHandle: followerAlias,
      followeeHandle: userToFollow.alias,
      followerName: followerUser.firstName,
      followeeName: userToFollow.firstName,
    };
    await this.followsDao.putFollower(updatedFollow);

    return [followerCount + 1, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    this.ensureTokenValid(token);
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    await this.userDao.updateCounts(
      userToUnfollow.alias,
      followeeCount,
      followerCount - 1
    );

    const followerAlias = (await this.authTokenDao.getAuthToken(token))?.alias;
    if (followerAlias === null || followerAlias === undefined) {
      throw new Error("Invalid token");
    }
    const followerUser = await this.userDao.getUser(followerAlias);
    if (followerUser === null || followerUser === undefined) {
      throw new Error("Invalid user");
    }
    const actedFollowerCount = await this.getFollowerCount(token, followerUser);
    const actedFolloweeCount = await this.getFolloweeCount(token, followerUser);
    await this.userDao.updateCounts(
      followerAlias,
      actedFolloweeCount - 1,
      actedFollowerCount
    );
    const updatedFollow: Follower = {
      followerHandle: followerAlias,
      followeeHandle: userToUnfollow.alias,
      followerName: followerUser.firstName,
      followeeName: userToUnfollow.firstName,
    };
    await this.followsDao.deleteFollower(updatedFollow);

    return [followerCount - 1, followeeCount];
  }

  public async dtoFromFollowerEntity(
    entity: Follower | null
  ): Promise<UserDto | null> {
    if (!entity) {
      return null;
    }
    const userEntity = await this.userDao.getUser(entity.followerHandle);
    if (userEntity == null) {
      return null;
    }
    const user = new User(
      userEntity.firstName,
      userEntity.lastName,
      userEntity.alias,
      userEntity.imageUrl
    );
    return user.dto;
  }

  public async dtoFromFolloweeEntity(
    entity: Follower | null
  ): Promise<UserDto | null> {
    if (!entity) {
      return null;
    }
    const userEntity = await this.userDao.getUser(entity.followeeHandle);
    if (userEntity == null) {
      return null;
    }
    const user = new User(
      userEntity.firstName,
      userEntity.lastName,
      userEntity.alias,
      userEntity.imageUrl
    );
    return user.dto;
  }
}

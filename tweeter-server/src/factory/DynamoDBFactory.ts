import { AuthTokenDao } from "../model/dao/AuthTokenDAO";
import { AuthTokenDynamoDBDao } from "../model/dao/dao-classes/AuthTokenDynamoDB";
import { FollowsDynamoDBDao } from "../model/dao/dao-classes/FollowsDynamoDB";
import { StatusDynamoDBDao } from "../model/dao/dao-classes/StatusDynamoDB";
import { UserDynamoDBDao } from "../model/dao/dao-classes/UserDynamoDB";
import { FollowsDao } from "../model/dao/FollowsDAO";
import { StatusDAO } from "../model/dao/StatusDAO";
import { UserDao } from "../model/dao/UserDAO";
import { Factory } from "./Factory";

export class DynamoDBFactory implements Factory {
  public getFollowsDao(): FollowsDao {
    return new FollowsDynamoDBDao();
  }
  public getStatusDao(): StatusDAO {
    return new StatusDynamoDBDao();
  }
  public getUserDao(): UserDao {
    return new UserDynamoDBDao();
  }
  public getAuthTokenDao(): AuthTokenDao {
    return new AuthTokenDynamoDBDao();
  }
}

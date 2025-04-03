import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDao } from "../UserDAO";
import { UserEntity } from "../../entities/UserEntity";

export class UserDynamoDBDao implements UserDao {
  readonly tableName = "users";
  readonly aliasAttr = "alias";
  readonly passwordAttr = "password";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly userImageUrlAttr = "user_image_url";
  readonly followersAttr = "follower_count";
  readonly followeesAttr = "followee_count";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putUser(user: UserEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: user.alias,
        [this.passwordAttr]: user.password,
        [this.firstNameAttr]: user.firstName,
        [this.lastNameAttr]: user.lastName,
        [this.userImageUrlAttr]: user.imageUrl,
        [this.followersAttr]: 0,
        [this.followeesAttr]: 0,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async getUser(alias: string): Promise<UserEntity | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateAliasItem(alias),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : {
          alias: output.Item[this.aliasAttr],
          password: output.Item[this.passwordAttr],
          firstName: output.Item[this.firstNameAttr],
          lastName: output.Item[this.lastNameAttr],
          imageUrl: output.Item[this.userImageUrlAttr],
        };
  }

  async getFollowerCount(alias: string): Promise<number | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
    };
    const output = await this.client.send(new GetCommand(params));
    if (output.Item === undefined) {
      console.log("user get returned undefined");
      throw new Error("No user found for getFollowerCount");
    } else {
      return output.Item[this.followersAttr];
    }
  }

  async getFolloweeCount(alias: string): Promise<number | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
    };
    const output = await this.client.send(new GetCommand(params));
    if (output.Item === undefined) {
      console.log("user get returned undefined");
      return null;
    } else {
      return output.Item[this.followeesAttr];
    }
  }

  async updateCounts(
    alias: string,
    followeeCount: number,
    followerCount: number
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
      UpdateExpression: "set followee_count = :fn, follower_count = :ln",
      ExpressionAttributeValues: {
        ":fn": followeeCount,
        ":ln": followerCount,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  async delete(user: UserEntity): Promise<void> {}

  public async deleteUser(alias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateAliasItem(alias),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateAliasItem(userAlias: string) {
    return {
      [this.aliasAttr]: userAlias,
    };
  }
}

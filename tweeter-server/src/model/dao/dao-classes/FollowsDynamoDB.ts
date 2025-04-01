import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowsDao } from "../FollowsDAO";
import { Follower } from "../../entities/Follower";
import { DataPage } from "../../entities/DataPage";

export class FollowsDynamoDBDao implements FollowsDao {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeHandleAttr = "followee_handle";
  readonly followeeNameAttr = "followee_name";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putFollower(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerHandleAttr]: follower.followerHandle,
        [this.followerNameAttr]: follower.followerName,
        [this.followeeHandleAttr]: follower.followeeHandle,
        [this.followeeNameAttr]: follower.followeeName,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async updateFollower(
    follower: Follower,
    follower_name: string,
    followee_name: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowerItem(follower),
      ExpressionAttributeValues: {
        ":followerName": follower_name,
        ":followeeName": followee_name,
      },
      UpdateExpression:
        "SET " +
        this.followerNameAttr +
        " = :followerName, " +
        this.followeeNameAttr +
        " = :followeeName",
    };
    await this.client.send(new UpdateCommand(params));
  }

  public async getFollower(follower: Follower): Promise<Follower | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowerItem(follower),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : {
          followerHandle: output.Item[this.followerHandleAttr],
          followerName: output.Item[this.followerNameAttr],
          followeeHandle: output.Item[this.followeeHandleAttr],
          followeeName: output.Item[this.followeeNameAttr],
        };
  }

  public async deleteFollower(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowerItem(follower),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateFollowerItem(follower: Follower) {
    return {
      [this.followerHandleAttr]: follower.followerHandle,
      [this.followeeHandleAttr]: follower.followeeHandle,
    };
  }

  private async executeFollowQuery(params: any): Promise<DataPage<Follower>> {
    const items: Follower[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push({
        followerName: item[this.followerNameAttr],
        followerHandle: item[this.followerHandleAttr],
        followeeName: item[this.followeeNameAttr],
        followeeHandle: item[this.followeeHandleAttr],
      })
    );
    return new DataPage<Follower>(items, hasMorePages);
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follower>> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: followerHandle,
              [this.followeeHandleAttr]: lastFolloweeHandle,
            },
    };

    const data = await this.executeFollowQuery(params);
    return data;
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follower>> {
    const params = {
      KeyConditionExpression: this.followeeHandleAttr + " = :fol",
      ExpressionAttributeValues: {
        ":fol": followeeHandle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: lastFollowerHandle,
              [this.followeeHandleAttr]: followeeHandle,
            },
    };

    const data = await this.executeFollowQuery(params);
    return data;
  }
}

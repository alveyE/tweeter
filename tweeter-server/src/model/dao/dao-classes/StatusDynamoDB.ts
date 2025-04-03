import { StatusDAO } from "../StatusDAO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusEntity } from "../../entities/StatusEntity";
import { DataPage } from "../../entities/DataPage";

export class StatusDynamoDBDao implements StatusDAO {
  readonly StoryTableName = "story";
  readonly FeedTableName = "feed";
  readonly poster_handleAttr = "user_handle";
  readonly timestampAttr = "timestamp";
  readonly statusAttr = "status";
  readonly ownerAttr = "feed_owner_handle";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putInStory(status: StatusEntity): Promise<void> {
    const params = {
      TableName: this.StoryTableName,
      Item: {
        [this.poster_handleAttr]: status.userHandle,
        [this.timestampAttr]: status.timestamp,
        [this.statusAttr]: status.status,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async putInFeed(owner_handle: string, status: StatusEntity): Promise<void> {
    const params = {
      TableName: this.FeedTableName,
      Item: {
        [this.ownerAttr]: owner_handle,
        [this.timestampAttr]: status.timestamp,
        [this.poster_handleAttr]: status.userHandle,
        [this.statusAttr]: status.status,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getPageOfStory(
    userHandle: string,
    pageSize: number,
    lastStoryStamp: number | undefined
  ): Promise<DataPage<StatusEntity>> {
    const params = {
      KeyConditionExpression: this.poster_handleAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": userHandle,
      },
      TableName: this.StoryTableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastStoryStamp === undefined
          ? undefined
          : {
              [this.poster_handleAttr]: userHandle,
              [this.timestampAttr]: lastStoryStamp,
            },
    };
    const items: StatusEntity[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      const status: StatusEntity = {
        userHandle: item[this.poster_handleAttr],
        status: item[this.statusAttr],
        timestamp: item[this.timestampAttr],
      };
      items.push(status);
    });
    return new DataPage<StatusEntity>(items, hasMorePages);
  }
  async getPageOfFeed(
    userHandle: string,
    pageSize: number,
    lastStoryStamp: number | undefined
  ): Promise<DataPage<StatusEntity>> {
    const params = {
      KeyConditionExpression: this.ownerAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": userHandle,
      },
      TableName: this.FeedTableName,
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        lastStoryStamp === undefined
          ? undefined
          : {
              [this.ownerAttr]: userHandle,
              [this.timestampAttr]: lastStoryStamp,
            },
    };
    const items: StatusEntity[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      let status: StatusEntity = {
        userHandle: item[this.poster_handleAttr],
        status: item[this.statusAttr],
        timestamp: item[this.timestampAttr],
      };

      items.push(status);
    });
    return new DataPage<StatusEntity>(items, hasMorePages);
  }
}

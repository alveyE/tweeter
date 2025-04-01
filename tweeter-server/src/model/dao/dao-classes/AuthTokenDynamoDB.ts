import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { AuthTokenDao } from "../AuthTokenDAO";
import { AuthTokenEntity } from "../../entities/AuthTokenEntity";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

export class AuthTokenDynamoDBDao implements AuthTokenDao {
  readonly tableName = "authTokens";
  readonly aliasAttr = "alias";
  readonly tokenAttr = "token";
  readonly timeStampAttr = "time_stamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putAuthToken(authToken: AuthTokenEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: authToken.alias,
        [this.tokenAttr]: authToken.token,
        [this.timeStampAttr]: authToken.timeStamp,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async getAuthToken(
    token: string
  ): Promise<AuthTokenEntity | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateTokenItem(token),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : {
          alias: output.Item[this.aliasAttr],
          token: output.Item[this.tokenAttr],
          timeStamp: output.Item[this.timeStampAttr],
        };
  }

  public async updateAuthToken(
    authToken: AuthTokenEntity,
    timeStamp: number
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateTokenItem(authToken.token),
      ExpressionAttributeValues: {
        ":timeStamp": timeStamp,
      },
      UpdateExpression: "SET " + this.timeStampAttr + " = :timeStamp",
    };
    await this.client.send(new UpdateCommand(params));
  }

  public async deleteAuthToken(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateTokenItem(token),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateTokenItem(token: string) {
    return {
      [this.tokenAttr]: token,
    };
  }
}

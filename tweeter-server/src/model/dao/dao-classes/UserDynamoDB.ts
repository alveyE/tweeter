import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDao } from "../UserDAO";
import { UserEntity } from "../../entities/UserEntity";

export class UserDynamoDBDao implements UserDao {
  readonly tableName = "users";
  readonly aliasAttr = "alias";
  readonly passwordAttr = "password";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly userImageBytesAttr = "user_image_bytes";
  readonly imageFileExtAttr = "image_file_ext";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putUser(user: UserEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: user.alias,
        [this.passwordAttr]: user.password,
        [this.firstNameAttr]: user.firstName,
        [this.lastNameAttr]: user.lastName,
        [this.userImageBytesAttr]: user.userImageBytes,
        [this.imageFileExtAttr]: user.imageFileExtension,
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
          userImageBytes: output.Item[this.userImageBytesAttr],
          imageFileExtension: output.Item[this.imageFileExtAttr],
        };
  }

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

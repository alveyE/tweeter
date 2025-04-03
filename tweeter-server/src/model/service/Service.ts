import { AuthTokenDao } from "../dao/AuthTokenDAO";
import { AuthTokenDynamoDBDao } from "../dao/dao-classes/AuthTokenDynamoDB";

export class Service {
  protected authTokenDao: AuthTokenDao;

  constructor() {
    this.authTokenDao = new AuthTokenDynamoDBDao();
  }
  protected async ensureTokenValid(token: string): Promise<void> {
    const authToken = await this.authTokenDao.getAuthToken(token);
    if (authToken === undefined) {
      throw new Error("Invalid token");
    }
    if (!authToken.isValid()) {
      throw new Error("Token expired");
    }
  }
}

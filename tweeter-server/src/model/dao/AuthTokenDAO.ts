import { AuthTokenEntity } from "../entities/AuthTokenEntity";

export interface AuthTokenDao {
  putAuthToken(authToken: AuthTokenEntity): Promise<void>;

  getAuthToken(token: string): Promise<AuthTokenEntity | undefined>;

  updateAuthToken(authToken: AuthTokenEntity, timeStamp: number): Promise<void>;

  deleteAuthToken(token: string): Promise<void>;
}

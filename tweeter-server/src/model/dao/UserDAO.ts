import { UserEntity } from "../entities/UserEntity";

export interface UserDao {
  putUser(user: UserEntity): Promise<void>;
  getUser(alias: string): Promise<UserEntity | undefined>;
  getFollowerCount(user: string): Promise<number | null>;
  getFolloweeCount(user: string): Promise<number | null>;
  updateCounts(
    oldUser: string,
    followeeCount: number,
    followerCount: number
  ): Promise<void>;
}

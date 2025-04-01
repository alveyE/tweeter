import { UserEntity } from "../entities/UserEntity";

export interface UserDao {
  putUser(user: UserEntity): Promise<void>;
  getUser(alias: string): Promise<UserEntity | undefined>;
}

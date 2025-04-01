import { AuthTokenDao } from "../model/dao/AuthTokenDAO";
import { FollowsDao } from "../model/dao/FollowsDAO";
import { StatusDAO } from "../model/dao/StatusDAO";
import { UserDao } from "../model/dao/UserDAO";

export interface Factory {
  getFollowsDao(): FollowsDao;
  getStatusDao(): StatusDAO;
  getUserDao(): UserDao;
  getAuthTokenDao(): AuthTokenDao;
}

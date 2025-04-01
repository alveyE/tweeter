import { DataPage } from "../entities/DataPage";
import { Follower } from "../entities/Follower";

export interface FollowsDao {
  putFollower(follower: Follower): Promise<void>;

  updateFollower(
    follower: Follower,
    follower_name: string,
    followee_name: string
  ): Promise<void>;

  getFollower(follower: Follower): Promise<Follower | undefined>;

  deleteFollower(follower: Follower): Promise<void>;

  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follower>>;

  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follower>>;
}

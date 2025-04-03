import { DataPage } from "../entities/DataPage";
import { StatusEntity } from "../entities/StatusEntity";

export interface StatusDAO {
  putInStory(status: StatusEntity): Promise<void>;
  putInFeed(owner_handle: string, status: StatusEntity): Promise<void>;
  getPageOfStory(
    userHandle: string,
    pageSize: number,
    lastStoryStamp: number | undefined
  ): Promise<DataPage<StatusEntity>>;
  getPageOfFeed(
    userHandle: string,
    pageSize: number,
    lastStoryStamp: number | undefined
  ): Promise<DataPage<StatusEntity>>;
}

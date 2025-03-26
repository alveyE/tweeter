import { UserDto } from "../../../dto/UserDto";

export interface FollowRequest {
  readonly token: string;
  readonly user: UserDto;
}

export interface IsFollowerRequest extends FollowRequest {
  readonly selectedUser: UserDto;
}

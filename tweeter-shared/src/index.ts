export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.

export type { UserDto } from "./model/dto/UserDto";
export type { StatusDto } from "./model/dto/StatusDto";
export type { PostSegmentDto } from "./model/dto/PostSegmentDto";

export type { TweeterRequest } from "./model/domain/net/request/TweeterRequest";
export type { PagedUserItemRequest } from "./model/domain/net/request/PagedUserItemRequest";
export type {
  LogoutRequest,
  RegisterRequest,
  AuthenticationRequest,
} from "./model/domain/net/request/AuthenticationRequest";
export type { GetUserRequest } from "./model/domain/net/request/GetUserRequest";
export type {
  FollowRequest,
  IsFollowerRequest,
} from "./model/domain/net/request/FollowRequest";
export type { PagedStatusItemRequest } from "./model/domain/net/request/PagedStatusItemRequest";
export type { PostStatusRequest } from "./model/domain/net/request/PostStatusRequest";

export type { TweeterResponse } from "./model/domain/net/response/TweeterResponse";
export type { PagedUserItemResponse } from "./model/domain/net/response/PagedUserItemResponse";
export type { AuthenticationResponse } from "./model/domain/net/response/AuthenticationResponse";
export type { GetUserResponse } from "./model/domain/net/response/GetUserResponse";
export type {
  FollowResponse,
  FollowCountResponse,
  IsFollowerResponse,
} from "./model/domain/net/response/FollowResponse";
export type { PagedStatusItemResponse } from "./model/domain/net/response/PagedStatusItemResponse";

export { FakeData } from "./util/FakeData";

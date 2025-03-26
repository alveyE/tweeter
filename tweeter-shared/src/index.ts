export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.

export type { UserDto } from "./model/dto/UserDto";

export type { PagedUserItemRequest } from "./model/domain/net/request/PagedUserItemRequest";
export type { AuthenticationRequest } from "./model/domain/net/request/AuthenticationRequest";
export type { LogoutRequest } from "./model/domain/net/request/AuthenticationRequest";
export type { RegisterRequest } from "./model/domain/net/request/AuthenticationRequest";
export type { GetUserRequest } from "./model/domain/net/request/GetUserRequest";

export type { TweeterResponse } from "./model/domain/net/response/TweeterResponse";
export type { PagedUserItemResponse } from "./model/domain/net/response/PagedUserItemResponse";
export type { AuthenticationResponse } from "./model/domain/net/response/AuthenticationResponse";
export type { GetUserResponse } from "./model/domain/net/response/GetUserResponse";

export { FakeData } from "./util/FakeData";

import { TweeterResponse } from "./TweeterResponse";

export interface FollowCountResponse extends TweeterResponse {
  readonly followCount: number;
}

export interface FollowResponse extends FollowCountResponse {
  readonly secondFollowCount: number;
}

export interface IsFollowerResponse extends TweeterResponse {
  readonly isFollower: boolean;
}

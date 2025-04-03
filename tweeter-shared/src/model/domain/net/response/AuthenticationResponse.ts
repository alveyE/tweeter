import { UserDto } from "../../../dto/UserDto";
import { AuthToken } from "../../AuthToken";
import { TweeterResponse } from "./TweeterResponse";

export interface AuthenticationResponse extends TweeterResponse {
  readonly user: UserDto;
  readonly token: string;
}

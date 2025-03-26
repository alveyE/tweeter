import { TweeterRequest } from "./TweeterRequest";

export interface AuthenticationRequest extends TweeterRequest {
  readonly userAlias: string;
  readonly password: string;
}

export interface LogoutRequest extends TweeterRequest {}

export interface RegisterRequest extends AuthenticationRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly userImageBytes: Uint8Array | string;
  readonly imageFileExtension: string;
}

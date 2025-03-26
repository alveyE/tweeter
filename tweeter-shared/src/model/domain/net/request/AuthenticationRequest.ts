export interface AuthenticationRequest {
  readonly userAlias: string;
  readonly password: string;
}

export interface LogoutRequest {
  readonly token: string;
}

export interface RegisterRequest extends AuthenticationRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly userImageBytes: Uint8Array | string;
  readonly imageFileExtension: string;
}

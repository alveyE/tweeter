import { UserService } from "../../model/service/UserService";
import { AuthenticationRequest, AuthenticationResponse } from "tweeter-shared";

export const handler = async (
  request: AuthenticationRequest
): Promise<AuthenticationResponse> => {
  const userService = new UserService();
  const [userDto, token] = await userService.login(
    request.userAlias,
    request.password
  );

  return {
    success: true,
    message: "Success",
    user: userDto,
    token: token,
  };
};

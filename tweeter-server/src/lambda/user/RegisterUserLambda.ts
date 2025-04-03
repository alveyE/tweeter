import { AuthenticationResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: RegisterRequest
): Promise<AuthenticationResponse> => {
  const userService = new UserService();
  const [userDto, token] = await userService.register(
    request.firstName,
    request.lastName,
    request.userAlias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: "Success",
    user: userDto,
    token: token,
  };
};

import { Buffer } from "buffer";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const [userDto, authToken] = await this.serverFacade.getAuthentication(
      {
        token: "",
        userAlias: alias,
        password: password,
      },
      "/user/login",
      "Login failed"
    );
    return [User.fromDto(userDto)!, authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await this.serverFacade.logout({
      token: authToken.token,
    });
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const [userDto, authToken] = await this.serverFacade.getAuthentication(
      {
        token: "",
        userAlias: alias,
        password: password,
        firstName: firstName,
        lastName: lastName,
        userImageBytes: imageStringBase64,
        imageFileExtension: imageFileExtension,
      },
      "/register",
      "User could not be registered"
    );

    return [User.fromDto(userDto)!, authToken];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return await this.serverFacade.getIsFollowerStatus({
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    });
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.serverFacade.getFollowCount(
      {
        token: authToken.token,
        user: user.dto,
      },
      "/followee/count"
    );
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.serverFacade.getFollowCount(
      {
        token: authToken.token,
        user: user.dto,
      },
      "/follower/count"
    );
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await this.serverFacade.followUnfollow(
      {
        token: authToken.token,
        user: userToFollow.dto,
      },
      "/follow/follow"
    );
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await this.serverFacade.followUnfollow(
      {
        token: authToken.token,
        user: userToUnfollow.dto,
      },
      "/follow/unfollow"
    );
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const user = await this.serverFacade.getUser({
      token: authToken.token,
      userAlias: alias,
    });
    return User.fromDto(user);
  }
}

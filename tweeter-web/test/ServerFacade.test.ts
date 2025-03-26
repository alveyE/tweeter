import "isomorphic-fetch";
import { Buffer } from "buffer";
import { ServerFacade } from "../src/network/ServerFacade";
import {
  FollowRequest,
  PagedUserItemRequest,
  RegisterRequest,
  UserDto,
} from "tweeter-shared";

describe("StatusService", () => {
  let serverFacade: ServerFacade;
  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  it("registers new user", async () => {
    const userImage = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const imageStringBase64: string = Buffer.from(userImage).toString("base64");
    const registerRequest: RegisterRequest = {
      token: "authToken123",
      userAlias: "@testUser",
      password: "password123",
      firstName: "Ethan",
      lastName: "Alvey",
      userImageBytes: imageStringBase64,
      imageFileExtension: "jpg",
    };

    const [user, authToken] = await serverFacade.getAuthentication(
      registerRequest,
      "/user/register",
      "User could not be registered"
    );
    expect(user).toBeDefined();
    expect(authToken).toBeDefined();
  });

  it("gets followers", async () => {
    const getFollowerRequest: PagedUserItemRequest = {
      token: "authToken123",
      userAlias: "@testUser",
      pageSize: 10,
      lastItem: null,
    };

    const [user, hasMore] = await serverFacade.getMoreFollows(
      getFollowerRequest,
      "/follower/list"
    );
    expect(user).toBeDefined();
    expect(hasMore).toBeDefined();
  });

  it("gets folowees count", async () => {
    const userDto: UserDto = {
      firstName: "Ethan",
      lastName: "Alvey",
      alias: "@ethan",
      imageUrl: "https://example.com/image.jpg",
    };

    const getFolloweeRequest: FollowRequest = {
      token: "authToken123",
      user: userDto,
    };

    const followeeCount = await serverFacade.getFollowCount(
      getFolloweeRequest,
      "/followee/count"
    );
    expect(followeeCount).toBeGreaterThan(-1);
  });
});

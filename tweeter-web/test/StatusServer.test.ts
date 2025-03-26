import "isomorphic-fetch";
import { StatusService } from "../src/model/service/StatusService";
import { AuthToken } from "tweeter-shared";
import { Status } from "tweeter-shared";
describe("StatusService", () => {
  let statusService: StatusService;
  beforeAll(() => {
    statusService = new StatusService();
  });

  it("returns story items", async () => {
    const authToken = new AuthToken("token33", Date.now());
    const userAlias = "@testUser";
    const pageSize = 10;
    const lastItem: Status | null = null;
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );
    expect(storyItems).toBeDefined();
    expect(hasMore).toBeDefined();
  });
});

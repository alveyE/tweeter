import { AuthToken, Status, User } from "tweeter-shared";
import { PostPresenter, PostView } from "../../src/presenters/PostPresenter";
import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
  deepEqual,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostView;
  let postStatusPresenter: PostPresenter;
  let mockStatusService: StatusService;
  const timestamp = 1000000000000;
  const authToken = new AuthToken("abc123", timestamp);
  const user = new User("ethan", "alvey", "ethan1", "image");
  const status = new Status("test post", user, timestamp);

  beforeEach(() => {
    mockPostStatusView = mock<PostView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    const postStatusPresenterSpy = spy(
      new PostPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    jest.spyOn(Date, "now").mockReturnValue(timestamp);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);
    when(postStatusPresenterSpy.postService).thenReturn(
      mockStatusServiceInstance
    );
  });

  it("tells the view to display that status is posting", async () => {
    await postStatusPresenter.submitPost(user, authToken, "test post");
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls post status", async () => {
    await postStatusPresenter.submitPost(user, authToken, "test post");
    verify(mockStatusService.postStatus(anything(), anything())).once();
  });

  it("clears info message and post, verifies post was successful", async () => {
    await postStatusPresenter.submitPost(user, authToken, "test post");
    verify(mockPostStatusView.clearLastInfoMessage()).once();

    verify(
      mockPostStatusView.displayInfoMessage("Status posted successfully!", 2000)
    ).once();

    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("dsiplays error when post does not work", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(authToken, deepEqual(status))).thenThrow(
      error
    );

    await postStatusPresenter.submitPost(user, authToken, "test post");

    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: An error occurred"
      )
    ).once();

    verify(mockPostStatusView.clearLastInfoMessage()).once();

    verify(
      mockPostStatusView.displayInfoMessage("Status posted successfully!", 2000)
    ).never();
  });
});

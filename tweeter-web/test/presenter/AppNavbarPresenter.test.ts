import { AuthToken } from "tweeter-shared";
import {
  NavbarPresenter,
  NavbarView,
} from "../../src/presenters/NavbarPresenter";
import { UserService } from "../../src/model/service/UserService";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: NavbarView;
  let appNavbarPresenter: NavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<NavbarView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);
    const appNavbarPresenterSpy = spy(
      new NavbarPresenter(mockAppNavbarViewInstance)
    );
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);
    when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockUserService.logout(anything())).once();

    // let [capturedAuthToken] = capture(mockUserService.logout).last();
    // expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the last info message, clear the user info, and navigate to the login page when logout is successful", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.clearLastInfoMessage()).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.displayErrorMessage(anything())).never();
  });

  it("displays an error message and does not clear the last info message, clear the user info, and navigate to the login page when logout fails", async () => {
    const error = new Error("An error occurred");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavbarPresenter.logOut(authToken);

    // let [capturedErrorMessage] = capture(
    //   mockAppNavbarView.displayErrorMessage
    // ).last();
    // console.log(capturedErrorMessage);

    verify(
      mockAppNavbarView.displayErrorMessage(
        "Failed to log user out because of exception: An error occurred"
      )
    ).once();

    verify(mockAppNavbarView.clearLastInfoMessage()).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
  });
});

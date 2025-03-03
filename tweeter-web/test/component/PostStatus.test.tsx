import PostStatus from "../../src/components/postStatus/PostStatus";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AuthToken, User } from "tweeter-shared";
import { PostPresenter } from "../../src/presenters/PostPresenter";
import useUserInfo from "../../src/hooks/userInfoHook";

jest.mock("../../src/hooks/userInfoHook", () => ({
  ...jest.requireActual("../../src/hooks/userInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockAuthToken = mock<AuthToken>();
  const mockUser = mock<User>();
  const mockAuthTokenInstance = instance(mockAuthToken);
  const mockUserInstance = instance(mockUser);

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("When first rendered the Post Status and Clear buttons are both disabled", () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, clearButton } = renderPostStatusAndGetElements(
      mockPresenterInstance
    );
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
  it("Both buttons are enabled when the text field has text", async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, clearButton, user, textField } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(textField, "lolz");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });
  it("Both buttons are disabled when the text field is cleared", async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, clearButton, user, textField } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
  it("The presenter's submitPost method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, user, textField } =
      renderPostStatusAndGetElements(mockPresenterInstance);
    const text = "lolz";

    await user.type(textField, text);

    await user.click(postStatusButton);
    await waitFor(() =>
      verify(
        mockPresenter.submitPost(mockUserInstance, mockAuthTokenInstance, text)
      ).once()
    );
  });
});

const renderPostStatus = (presenter?: PostPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);
  const postStatusButton = screen.getByLabelText("postStatus");
  const clearButton = screen.getByLabelText("clear");
  const textField = screen.getByLabelText("text");

  return { postStatusButton, clearButton, textField, user };
};

import { instance, mock, verify } from "@typestrong/ts-mockito";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import Login from "../../src/components/authentication/login/Login";
import { LoginPresenter } from "../../src/presenters/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  it("When first rendered the sign-in button is disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });
  it("The sign-in button is enabled when both the alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "abc");
    await user.type(passwordField, "abcdefg");
    expect(signInButton).toBeEnabled();
  });
  it("The sign-in button is disabled if either the alias or password field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "abc");
    await user.type(passwordField, "abcdefg");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "abc");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });
  it("presenter's login method is called with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const originalUrl = "http://test.com";
    const alias = "@test";
    const password = "testPassword";
    const rememberMe = false;

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);
    verify(
      mockPresenter.doLogin(alias, password, rememberMe, originalUrl)
    ).once();
  });
});

const renderLogin = (originalUrl?: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      <Login originalUrl={originalUrl} presenter={presenter} />
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl?: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};

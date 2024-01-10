import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

describe("Routing", () => {
  const setup = (path) => {
    window.history.pushState({}, "", path);
    render(<App />);
  }

  it.each`
    path | pageTestId
    ${"/"} | ${"home-page"}
    ${"/signup"} | ${"signup-page"}
    ${"/login"} | ${"login-page"}
    ${"/user/1"} | ${"user-page"}
    ${"/user/2"} | ${"user-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);
    const page = screen.getByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path | pageTestId
    ${"/"} | ${"signup-page"}
    ${"/"} | ${"login-page"}
    ${"/"} | ${"user-page"}
    ${"/signup"} | ${"home-page"}
    ${"/signup"} | ${"login-page"}
    ${"/signup"} | ${"user-page"}
    ${"/login"} | ${"home-page"}
    ${"/login"} | ${"signup-page"}
    ${"/login"} | ${"user-page"}
    ${"/user/1"} | ${"home-page"}
    ${"/user/1"} | ${"signup-page"}
    ${"/user/1"} | ${"login-page"}
  `("does not display $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);
    const page = screen.getByTestId(pageTestId);
    expect(page).not.toBeInTheDocument();
  });

  it.each`
    targetPage
    ${"Home"}
    ${"Sign Up"}
    ${"Login"}
  `
  ("has link to homepage on NavBar", ({ targetPage }) => {
    setup("/");
    const homeLink = screen.getByRole("link", { name: targetPage });
    expect(homeLink).toBeInTheDocument();
  });

  it.each`
    initialPath | clickingTo | visiblePage
    ${"/"} | ${"Sign Up"} | ${"signup-page"}
    ${"/signup"} | ${"Home"} | ${"home-page"}
    ${"/signup"} | ${"Login"} | ${"login-page"}
  `

  it("displays $visiblePage after clicking $clickingTo", ({ initialPath, clickingTo, visiblePage }) => {
    setup(initialPath);
    const signupLink = screen.getByRole("link", { name: clickingTo});
    userEvent.click(signupLink);
    const signupPage = screen.getByTestId(visiblePage);
    expect(signupPage).toBeInTheDocument();
  });

  it("displays homepage when clicking on logo", () => {
    setup("/signup");
    const logo = screen.queryByAltText("tdd.io logo");
    userEvent.click(logo);
    const homePage = screen.getByTestId("home-page");
    expect(homePage).toBeInTheDocument();
  });
});
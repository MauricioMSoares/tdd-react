import { render, screen } from "@testing-library/react";
import SignupPage from "./SignupPage";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("SignupPage", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignupPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });

    it("has username input", () => {
      render(<SignupPage />);
      const input = screen.queryByLabelText("Username");
      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      render(<SignupPage />);
      const input = screen.queryByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      render(<SignupPage />);
      const input = screen.queryByLabelText("Password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      render(<SignupPage />);
      const input = screen.queryByLabelText("Password");
      expect(input.type).toBe("password");
    });

    it("has password repeat input", () => {
      render(<SignupPage />);
      const input = screen.queryByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password repeat input", () => {
      render(<SignupPage />);
      const input = screen.queryByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });

    it("has Sign Up button", () => {
      render(<SignupPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });

    it("disables the button initially", () => {
      render(<SignupPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    it("enables the button when password and password repeat have same value", () => {
      render(<SignupPage />);
      const passwordInput = screen.queryByLabelText("Password");
      const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeEnabled();
    });

    it("sends username, email and password to backend after clicking the button", async () => {
      render(<SignupPage />);
      const usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("E-mail");
      const passwordInput = screen.queryByLabelText("Password");
      const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
      userEvent.type(usernameInput, "User");
      userEvent.type(emailInput, "user@user.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Sign Up" });

      const mockFn = jest.fn();
      window.fetch = mockFn;

      userEvent.click(button);

      const firstCallOfMockFunction = mockFn.mock.calls[0];
      const body = JSON.parse(firstCallOfMockFunction[1].body);
      expect(body).toEqual({
        username: "User",
        email: "user@user.com",
        password: "P4ssword",
      });
    });
  });
});
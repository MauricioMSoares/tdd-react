import { render, screen, waitFor } from "@testing-library/react";
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

    let button;

    const setup = () => {
      const usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("E-mail");
      const passwordInput = screen.queryByLabelText("Password");
      const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
      userEvent.type(usernameInput, "User");
      userEvent.type(emailInput, "user@user.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      button = screen.queryByRole("button", { name: "Sign Up" });
    }

    it("enables the button when password and password repeat have same value", () => {
      setup();
      expect(button).toBeEnabled();
    });

    it("sends username, email and password to backend after clicking the button", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body
          return res(ctx.status(201))
        })
      );
      server.listen();

      setup();

      userEvent.click(button);

      await screen.findByText("Please check your e-mail to activate your account");

      const firstCallOfMockFunction = mockFn.mock.calls[0];
      const body = JSON.parse(firstCallOfMockFunction[1].body);
      expect(body).toEqual({
        username: "User",
        email: "user@user.com",
        password: "P4ssword",
      });
    });

    it("disables button when there is an ongoing API call", async () => {
      let counter = 0;
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          counter += 1;
          requestBody = req.body
          return res(ctx.status(201))
        })
      );
      server.listen();

      setup();

      userEvent.click(button);
      userEvent.click(button);

      await screen.findByText("Please check your e-mail to activate your account");

      expect(counter).toBe(1);
    });

    ("displays spinner after clicking submit button", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body
          return res(ctx.status(201))
        })
      );
      server.listen();

      setup();

      expect(screen.queryByRole("status", { hidden: true })).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole("status", { hidden: true });

      expect(spinner).toBeInTheDocument();
      await screen.findByText("Please check your e-mail to activate your account");
    });

    it("displays account activation notification after successful sign up request", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body
          return res(ctx.status(201))
        })
      );
      server.listen();
      setup();

      const message = "Please check your e-mail to activate your account";
      expect(message).not.toBeInTheDocument();

      userEvent.click(button);
      const text = await screen.findByText(message);

      expect(text).toBeInTheDocument();
    });

    it("hides sign up form after successful sign up request", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(201))
        })
      );
      server.listen();
      setup();

      const form = screen.getByTestId("form-signup");
      userEvent.click(button);

      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      })
    })
  });
});
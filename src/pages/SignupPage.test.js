import { act, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import SignupPage from "./SignupPage";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import "../locale/i18n";
import en from "../locale/en.json";
import ja from "../locale/ja.json";
import LanguageSelector from "../components/LanguageSelector";
import i18n from "../locale/i18n";

let counter = 0;
let requestBody;
let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", (req, res, ctx) => {
    requestBody = req.body
    counter += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(ctx.status(201))
  })
);

beforeEach(() => {
  counter = 0
  server.resetHandlers();
});
beforeAll(() => server.listen());
afterAll(() => server.close());

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
    let button, usernameInput, emailInput, passwordInput, passwordRepeatInput;

    const setup = () => {
      usernameInput = screen.queryByLabelText("Username");
      emailInput = screen.queryByLabelText("E-mail");
      passwordInput = screen.queryByLabelText("Password");
      passwordRepeatInput = screen.queryByLabelText("Password Repeat");
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
      setup();

      userEvent.click(button);
      userEvent.click(button);

      await screen.findByText("Please check your e-mail to activate your account");

      expect(counter).toBe(1);
    });

    ("displays spinner after clicking submit button", async () => {
      setup();

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole("status");

      expect(spinner).toBeInTheDocument();
      await screen.findByText("Please check your e-mail to activate your account");
    });

    it("displays account activation notification after successful sign up request", async () => {
      setup();

      const message = "Please check your e-mail to activate your account";
      expect(message).not.toBeInTheDocument();

      userEvent.click(button);
      const text = await screen.findByText(message);

      expect(text).toBeInTheDocument();
    });

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res.once(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message
            }
          })
        );
      })
    };

    it.each`
      field | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"} | ${"E-mail cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);

      expect(validationError).toBeInTheDocument();
    });

    it("hides sign up form after successful sign up request", async () => {
      setup();

      const form = screen.getByTestId("form-signup");
      userEvent.click(button);

      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      })
    });

    it("hides spinner and enables button after response received", async () => {
      server.use(generateValidationError("username", "Username cannot be null"));
      setup();
      userEvent.click(button);

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it("displays mismatch message for password repeat input", () => {
      setup();
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "AnotherP4ssword");
      const validationError = screen.queryByText("Password mismatch");
      expect(validationError).toBeInTheDocument();
    });

    it.each`
      field | message | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"} | ${"E-mail cannot be null"} | ${"E-mail"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `("clears validation error after $field is updated", async (field, message, label) => {
      server.use(generateValidationError(field, message));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      userEvent.type(screen.getByLabelText(label), "updated");
      expect(validationError).not.toBeInTheDocument();
    });
  });

  describe("Internationalization", () => {
    let japaneseToggle, englishToggle, passwordInput, passwordRepeatInput;
    const setup = () => {
      render(
        <>
          <SignupPage />
          <LanguageSelector />
        </>
      );
      japaneseToggle = screen.getByTitle("日本語");
      englishToggle = screen.getByTitle("English");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
    };

    afterEach(() => {
      act(() => {
        i18n.changeLanguage("en");
      });
    });

    it("initially displays all text in English", () => {
      setup();

      const header = screen.queryByRole("heading", { name: en.signup });
      expect(header).toBeInTheDocument();

      const button = screen.queryByRole("button", { name: en.signup });
      expect(button).toBeInTheDocument();

      const usernameLabel = screen.queryByLabelText(en.username);
      expect(usernameLabel).toBeInTheDocument();

      const emailLabel = screen.queryByLabelText(en.email);
      expect(emailLabel).toBeInTheDocument();

      const passwordLabel = screen.queryByLabelText(en.password);
      expect(passwordLabel).toBeInTheDocument();

      const passwordRepeatLabel = screen.queryByLabelText(en.passwordRepeat);
      expect(passwordRepeatLabel).toBeInTheDocument();
    });

    it("displays all text in Japanese after changing the language", () => {
      setup();

      userEvent.click(japaneseToggle);

      const header = screen.queryByRole("heading", { name: ja.signup });
      expect(header).toBeInTheDocument();

      const button = screen.queryByRole("button", { name: ja.signup });
      expect(button).toBeInTheDocument();

      const usernameLabel = screen.queryByLabelText(ja.username);
      expect(usernameLabel).toBeInTheDocument();

      const emailLabel = screen.queryByLabelText(ja.email);
      expect(emailLabel).toBeInTheDocument();

      const passwordLabel = screen.queryByLabelText(ja.password);
      expect(passwordLabel).toBeInTheDocument();

      const passwordRepeatLabel = screen.queryByLabelText(ja.passwordRepeat);
      expect(passwordRepeatLabel).toBeInTheDocument();
    });

    it("displays all text in English after changing back from Japanese", () => {
      setup();

      userEvent.click(japaneseToggle);
      userEvent.click(englishToggle);

      const header = screen.queryByRole("heading", { name: en.signup });
      expect(header).toBeInTheDocument();

      const button = screen.queryByRole("button", { name: en.signup });
      expect(button).toBeInTheDocument();

      const usernameLabel = screen.queryByLabelText(en.username);
      expect(usernameLabel).toBeInTheDocument();

      const emailLabel = screen.queryByLabelText(en.email);
      expect(emailLabel).toBeInTheDocument();

      const passwordLabel = screen.queryByLabelText(en.password);
      expect(passwordLabel).toBeInTheDocument();

      const passwordRepeatLabel = screen.queryByLabelText(en.passwordRepeat);
      expect(passwordRepeatLabel).toBeInTheDocument();
    });

    it("displays password mismatch validation in Japanese", () => {
      setup();

      userEvent.click(japaneseToggle);

      const passwordInput = screen.getByLabelText(ja.password);
      userEvent.type(passwordInput, "P4ss");

      const validationMessageInJapanese = screen.queryByText(ja.passwordMismatch);
      expect(validationMessageInJapanese).toBeInTheDocument();
    });

    it("sends accept language header as en for outgoing request", async () => {
      setup();

      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");

      const button = screen.queryByRole("button", { name: en.signup });
      const form = screen.queryByTestId("form-signup");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);

      expect(acceptLanguageHeader).toBe("en");
    });

    it("sends accept language header as ja for outgoing request", async () => {
      setup();

      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      userEvent.click(japaneseToggle);

      const button = screen.queryByRole("button", { name: ja.signup });
      const form = screen.queryByTestId("form-signup");

      userEvent.click(button);
      await waitForElementToBeRemoved(form);

      expect(acceptLanguageHeader).toBe("ja");
    });
  });
});
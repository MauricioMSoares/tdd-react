import { render, screen } from "@testing-library/react";
import AccountActivationPage from "./AccountActivationPage";
import { setupServer } from "msw/node";
import { rest } from "msw";

let counter = 0;
const server = setupServer(
  rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
    if (req.params.token === "5678") {
      return res(ctx.status(400));
    }

    counter += 1;
    return res(ctx.status(200))
  })
);

beforeEach(() => {
  counter = 0
  server.resetHandlers();
});
beforeAll(() => server.listen());
afterAll(() => server.close());

describe("AccountActivationPage", () => {
  const setup = (token) => {
    const match = { params: { token } };
    render(<AccountActivationPage match={match} />);
  }

  it("displays activation success message when token is valid", async () => {
    setup("1234");
    const message = await screen.findByText("Successfully activated!");
    expect(message).toBeInTheDocument();
  });

  it("sends activation request to backend", async () => {
    setup("1234");
    await screen.findByText("Your account has been activated!");
    expect(counter).toBe(1);
  });

  it("displays activation failure message when token is invalid", async () => {
    setup("5678");
    await screen.findByText("Failed to activate account.");
    expect(message).toBeInTheDocument();
  });
});
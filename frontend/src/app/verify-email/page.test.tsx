import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerifyEmailPage from "./page";
import { sendEmailVerification } from "firebase/auth";

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn(() => "test@test.com"),
  }),
}));

jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

jest.mock("../../lib/firebase", () => ({
  auth: {
    currentUser: {
      uid: "123",
      email: "test@test.com",
    },
  },
}));

jest.mock("firebase/auth", () => ({
  sendEmailVerification: jest.fn(),
}));

describe("VerifyEmailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders verify email page", () => {
    render(<VerifyEmailPage />);

    expect(screen.getByText(/verify your email/i)).toBeInTheDocument();

    expect(
      screen.getByText(/test@test.com/i)
    ).toBeInTheDocument();
  });

  it("resends verification email successfully", async () => {
    (sendEmailVerification as jest.Mock).mockResolvedValue(undefined);

    render(<VerifyEmailPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /resend verification email/i,
      })
    );

    await waitFor(() => {
      expect(sendEmailVerification).toHaveBeenCalled();
    });

    expect(
      screen.getByText(
        /verification email sent again\. please check your inbox\./i
      )
    ).toBeInTheDocument();
  });

  it("shows error if resend fails", async () => {
    (sendEmailVerification as jest.Mock).mockRejectedValue(
      new Error("Failed request")
    );

    render(<VerifyEmailPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /resend verification email/i,
      })
    );

    expect(
      await screen.findByText(/failed request/i)
    ).toBeInTheDocument();
  });
});
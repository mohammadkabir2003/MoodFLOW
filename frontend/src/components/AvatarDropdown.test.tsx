import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AvatarDropdown from "./AvatarDropdown";
import { getDoc } from "firebase/firestore";

const mockSetOpen = jest.fn();
const mockLogout = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => "doc-ref"),
  getDoc: jest.fn(),
}));

describe("AvatarDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        username: "Sammy",
        email: "sammy@test.com",
        profilePicture: null,
      }),
    });
  });

  it("renders user data when dropdown is open", async () => {
    render(
      <AvatarDropdown
        user={{ uid: "123" }}
        open={true}
        setOpen={mockSetOpen}
        onLogout={mockLogout}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Sammy")).toBeInTheDocument();
    });

    expect(screen.getByText("sammy@test.com")).toBeInTheDocument();
  });

  it("calls logout handler", async () => {
    render(
      <AvatarDropdown
        user={{ uid: "123" }}
        open={true}
        setOpen={mockSetOpen}
        onLogout={mockLogout}
      />
    );

    const logoutButton = await screen.findByText("Sign out");

    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("closes dropdown on outside click", async () => {
    render(
      <AvatarDropdown
        user={{ uid: "123" }}
        open={true}
        setOpen={mockSetOpen}
        onLogout={mockLogout}
      />
    );

    fireEvent.mouseDown(document);

    await waitFor(() => {
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  it("filters out current page from menu", async () => {
    render(
      <AvatarDropdown
        user={{ uid: "123" }}
        open={true}
        setOpen={mockSetOpen}
        onLogout={mockLogout}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
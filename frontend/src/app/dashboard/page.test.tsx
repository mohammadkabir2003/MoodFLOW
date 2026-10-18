import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "./page";

const pushMock = jest.fn();
let mockUser: any = null;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/lib/firebase", () => ({
  auth: {},
  db: {},
}));

jest.mock("@/components/AvatarDropdown", () => {
  return function AvatarDropdown() {
    return <div data-testid="avatar-dropdown" />;
  };
});

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(mockUser);
    return jest.fn();
  }),
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "mock-collection-ref"),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "mock-timestamp"),
  doc: jest.fn(() => "mock-doc-ref"),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(() => "mock-query"),
  orderBy: jest.fn(() => "mock-orderBy"),
  limit: jest.fn(() => "mock-limit"),
}));

const { addDoc, getDoc, getDocs, deleteDoc } = require("firebase/firestore");

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = null;

    getDoc.mockResolvedValue({
      exists: () => false,
      data: () => ({}),
    });

    getDocs.mockResolvedValue({ docs: [] });

    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ chartData: [] }),
    });
  });

  it("renders the main dashboard sections", () => {
    render(<DashboardPage />);

    expect(screen.getByText(/log your mood/i)).toBeInTheDocument();
    expect(screen.getByText(/recent entries/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save entry/i })).toBeInTheDocument();
    expect(
      screen.getByText(/no mood entries yet\. save your first entry above\./i)
    ).toBeInTheDocument();
  });

  it("shows an error when saving while unauthenticated", async () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    expect(await screen.findByText(/user not authenticated/i)).toBeInTheDocument();
  });

  it("shows an error when an authenticated user saves with no input", async () => {
    mockUser = { uid: "user-123" };

    render(<DashboardPage />);

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    expect(await screen.findByText(/no input provided/i)).toBeInTheDocument();
  });

  it("saves a mood entry successfully", async () => {
    mockUser = { uid: "user-123" };

    (global as any).fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ moodScore: 4.2 }),
    });

    render(<DashboardPage />);

    fireEvent.click(screen.getByRole("button", { name: /good/i }));

    fireEvent.change(screen.getByLabelText(/what did you work on today\?/i), {
      target: { value: "Worked on dashboard tests" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    await waitFor(() => {
      expect((global as any).fetch).toHaveBeenCalledWith(
        "http://localhost:3001/analyzeMood",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        "mock-collection-ref",
        expect.objectContaining({
          emojiScore: 4,
          moodScore: 4.2,
          note: "Worked on dashboard tests",
          date: "mock-timestamp",
        })
      );
    });

    expect(await screen.findByText(/entry saved\./i)).toBeInTheDocument();
  });
    
  it("renders previous mood entries", async () => {
    mockUser = { uid: "user-123" };

    getDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            note: "Worked on MoodFLOW",
            moodScore: 4.5,
            emojiScore: 5,
            date: {
              toDate: () => new Date(),
            },
          }),
        },
      ],
    });

    render(<DashboardPage />);

    expect(
      await screen.findByText(/worked on moodflow/i)
    ).toBeInTheDocument();
  });

  it("shows error if firestore save fails", async () => {
    mockUser = { uid: "user-123" };

    addDoc.mockRejectedValue(new Error("Firestore failed"));

    (global as any).fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ moodScore: 4 }),
    });

    render(<DashboardPage />);

    fireEvent.click(screen.getByRole("button", { name: /good/i }));

    fireEvent.change(screen.getByLabelText(/what did you work on today\?/i), {
      target: { value: "Testing firestore error" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    expect(
      await screen.findByText(/firestore failed/i)
    ).toBeInTheDocument();
  });

  it("shows error when no emoji rating is provided", async () => {
    mockUser = { uid: "user-123" };

    render(<DashboardPage />);

    fireEvent.change(screen.getByLabelText(/what did you work on today\?/i), {
      target: { value: "Worked on testing" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    expect(
      await screen.findByText(/no emoji rating provided/i)
    ).toBeInTheDocument();
  });

  it("shows error when no note is provided", async () => {
    mockUser = { uid: "user-123" };

    render(<DashboardPage />);

    fireEvent.click(screen.getByRole("button", { name: /good/i }));

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    expect(
      await screen.findByText(/no note provided/i)
    ).toBeInTheDocument();
  });

  it("shows error when mood analysis request fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockUser = { uid: "user-123" };

    (global as any).fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Failed to analyze mood",
      }),
    });

    render(<DashboardPage />);

    fireEvent.click(screen.getByRole("button", { name: /good/i }));

    fireEvent.change(screen.getByLabelText(/what did you work on today\?/i), {
      target: { value: "Testing failure case" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    expect(
      await screen.findByText(/failed to analyze mood/i)
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("adds and removes tags", async () => {
    mockUser = { uid: "user-123" };

    render(<DashboardPage />);

    const tagInput = screen.getByPlaceholderText(
      /type a tag and press enter or comma/i
    );

    fireEvent.change(tagInput, {
      target: { value: "testing" },
    });

    fireEvent.keyDown(tagInput, {
      key: "Enter",
      code: "Enter",
    });

    expect(await screen.findByText("testing")).toBeInTheDocument();

    fireEvent.click(screen.getByText("testing"));

    await waitFor(() => {
      expect(screen.queryByText("testing")).not.toBeInTheDocument();
    });
  });

  it("deletes a mood entry successfully", async () => {
    mockUser = { uid: "user-123" };

    deleteDoc.mockResolvedValue(undefined);

    getDocs.mockResolvedValue({
      docs: [
        {
          id: "entry-1",
          data: () => ({
            note: "Delete this entry",
            moodScore: 4,
            emojiScore: 4,
            date: {
              toDate: () => new Date(),
            },
          }),
        },
      ],
    });

    render(<DashboardPage />);

    expect(
      await screen.findByText(/delete this entry/i)
    ).toBeInTheDocument();

    const menuButton = screen.getAllByRole("button").find((button) =>
      button.querySelector("svg")
    );

    fireEvent.click(menuButton!);

    const deleteButton = await screen.findByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalled();
    });

    expect(
      await screen.findByText(/entry deleted\./i)
    ).toBeInTheDocument();
  });
});
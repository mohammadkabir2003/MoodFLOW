import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MoodHistoryPage from "./page";

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

jest.mock("@/components/DashboardHeader", () => {
  return function DashboardHeader() {
    return <div data-testid="dashboard-header" />;
  };
});

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(mockUser);
    return jest.fn();
  }),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "mock-collection-ref"),
  getDocs: jest.fn(),
  orderBy: jest.fn(() => "mock-orderBy"),
  query: jest.fn(() => "mock-query"),
  deleteDoc: jest.fn(),
  doc: jest.fn(() => "mock-doc-ref"),
}));

const { getDocs, deleteDoc } = require("firebase/firestore");

describe("MoodHistoryPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = null;
    getDocs.mockResolvedValue({ docs: [] });
  });

  it("renders the history page shell", async () => {
    render(<MoodHistoryPage />);

    expect(screen.getByText(/mood history/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search entries by note, date, or tag/i)
    ).toBeInTheDocument();

    expect(await screen.findByText(/total entries/i)).toBeInTheDocument();
  });

  it("shows the empty state when there are no entries", async () => {
    mockUser = { uid: "user-123" };
    getDocs.mockResolvedValue({ docs: [] });

    render(<MoodHistoryPage />);

    expect(
      await screen.findByText(/no mood entries found for the selected filters/i)
    ).toBeInTheDocument();
  });

  it("renders fetched mood entries", async () => {
    mockUser = { uid: "user-123" };

    getDocs.mockResolvedValue({
      docs: [
        {
          id: "entry-1",
          data: () => ({
            emojiScore: 4,
            moodScore: 3.67,
            note: "Worked on the MoodFLOW history page",
            date: {
              toDate: () => new Date(),
            },
          }),
        },
      ],
    });

    render(<MoodHistoryPage />);

    expect(
      await screen.findByText(/worked on the moodflow history page/i)
    ).toBeInTheDocument();

    expect(
        await screen.findByText(/worked on the moodflow history page/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/score: 3.67/i)).toBeInTheDocument();
  });

  it("filters entries by search input", async () => {
    mockUser = { uid: "user-123" };

    getDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            emojiScore: 4,
            note: "Worked on React testing",
            date: {
              toDate: () => new Date(),
            },
          }),
        },
        {
          id: "2",
          data: () => ({
            emojiScore: 2,
            note: "Went to the gym",
            date: {
              toDate: () => new Date(),
            },
          }),
        },
      ],
    });

    render(<MoodHistoryPage />);

    expect(
      await screen.findByText(/worked on react testing/i)
    ).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      /search entries by note, date, or tag/i
    );

    fireEvent.change(searchInput, {
      target: { value: "react" },
    });

    expect(screen.getByText(/worked on react testing/i)).toBeInTheDocument();

    expect(
      screen.queryByText(/went to the gym/i)
    ).not.toBeInTheDocument();
  });

  it("filters entries by mood", async () => {
    mockUser = { uid: "user-123" };

    getDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            emojiScore: 5,
            note: "Excellent day",
            date: {
              toDate: () => new Date(),
            },
          }),
        },
        {
          id: "2",
          data: () => ({
            emojiScore: 1,
            note: "Bad day",
            date: {
              toDate: () => new Date(),
            },
          }),
        },
      ],
    });

    render(<MoodHistoryPage />);

    expect(await screen.findByText(/excellent day/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /😄 excellent/i })
    );

    expect(screen.getByText(/excellent day/i)).toBeInTheDocument();

    expect(
      screen.queryByText(/bad day/i)
    ).not.toBeInTheDocument();
  });

  it("deletes an entry", async () => {
    mockUser = { uid: "user-123" };

    deleteDoc.mockResolvedValue(undefined);

    getDocs.mockResolvedValue({
      docs: [
        {
          id: "entry-1",
          data: () => ({
            emojiScore: 4,
            note: "Delete me",
            date: {
              toDate: () => new Date(),
            },
          }),
        },
      ],
    });

    render(<MoodHistoryPage />);

    expect(await screen.findByText(/delete me/i)).toBeInTheDocument();

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
import { render, screen } from "@testing-library/react";
import DashboardHeader from "./DashboardHeader";

jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

describe("DashboardHeader", () => {
  it("renders the dashboard header", () => {
    render(<DashboardHeader />);

    expect(screen.getByText(/moodflow/i)).toBeInTheDocument();
  });
});
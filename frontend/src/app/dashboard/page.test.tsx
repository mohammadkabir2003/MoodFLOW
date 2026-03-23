import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from './page';

// Mock firebase auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, cb) => {
    cb({ uid: '123', email: 'test@example.com' });
    return jest.fn(); // unsubscribe mock
  }),
  getAuth: jest.fn(),
}));

jest.mock('../../lib/firebase', () => ({
  auth: {},
}));

// Mock next/navigation for header component
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  usePathname: jest.fn(() => '/dashboard'),
}));

// Mock Header
jest.mock('../../components/DashboardHeader', () => {
  return function MockHeader() {
    return <div data-testid="dashboard-header">Header</div>;
  };
});

describe('Dashboard Integration Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('Successful API response -> UI updates correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ moodScore: 8 }),
    });

    render(<DashboardPage />);

    // Select a mood
    const goodMoodBtn = screen.getByText('Good');
    await userEvent.click(goodMoodBtn);

    // Enter notes
    const notesInput = screen.getByPlaceholderText(/Write your notes here.../i);
    await userEvent.type(notesInput, 'Feeling nice today');

    // Click Save
    const saveBtn = screen.getByRole('button', { name: /Save Entry/i });
    await userEvent.click(saveBtn);

    // Verify fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/analyzeMood', expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Feeling nice today", emojiScore: 4 })
    }));

    // Verify success message appears
    expect(await screen.findByText('Successfully analyzed! Mood score: 8')).toBeInTheDocument();
  });

  test('Failed API response -> UI displays error message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<DashboardPage />);

    // Select a mood without notes
    const badMoodBtn = screen.getByText('Bad');
    await userEvent.click(badMoodBtn);

    const saveBtn = screen.getByRole('button', { name: /Save Entry/i });
    await userEvent.click(saveBtn);

    // Verify error message appears
    expect(await screen.findByText('Failed to save entry')).toBeInTheDocument();
  });
});

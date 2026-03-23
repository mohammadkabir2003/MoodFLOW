import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage from './page';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: class {},
}));

// Mock firebase firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Mock local firebase config
jest.mock('../../lib/firebase', () => ({
  auth: {},
  db: {},
}));

describe('SignUpPage Form Validation', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('Empty required fields -> validation error shown (HTML5 validation)', async () => {
    render(<SignUpPage />);
    const submitBtn = screen.getByRole('button', { name: "Sign Up" });
    // HTML form validation should prevent standard submission if fields are empty
    // so we can test if the inputs are marked required.
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i); // Two password fields
    
    expect(emailInput).toBeRequired();
    expect(passwordInputs[0]).toBeRequired();
    expect(passwordInputs[1]).toBeRequired();
  });

  test('Password mismatch -> error message appears', async () => {
    render(<SignUpPage />);
    
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInputs[0], 'password123');
    await userEvent.type(passwordInputs[1], 'password456');
    
    const submitBtn = screen.getByRole('button', { name: "Sign Up" }); // Using exact string for the button
    await userEvent.click(submitBtn);
    
    expect(await screen.findByText('Passwords must match.')).toBeInTheDocument();
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test('Invalid email -> error message appears', async () => {
    // We'll mock Firebase rejecting with an invalid email error
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Firebase: Error (auth/invalid-email).'));
    
    render(<SignUpPage />);
    
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInputs[0], 'password123');
    await userEvent.type(passwordInputs[1], 'password123');
    
    const submitBtn = screen.getByRole('button', { name: 'Sign Up' });
    
    // Using fireEvent.submit to bypass HTML5 validation or typing invalid email and trigger submit
    // In jsdom, type="email" with invalid email might NOT fire onSubmit if we use click.
    // However, if we wrap the form submit, we can do it:
    fireEvent.submit(submitBtn.closest('form') as HTMLFormElement);
    
    expect(await screen.findByText('Firebase: Error (auth/invalid-email).')).toBeInTheDocument();
  });

  test('Valid input -> form submits successfully and redirects', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: {
        uid: '123',
        email: 'test@example.com'
      }
    });

    render(<SignUpPage />);
    
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInputs[0], 'password123');
    await userEvent.type(passwordInputs[1], 'password123');
    
    const submitBtn = screen.getByRole('button', { name: 'Sign Up' });
    fireEvent.submit(submitBtn.closest('form') as HTMLFormElement);
    
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});

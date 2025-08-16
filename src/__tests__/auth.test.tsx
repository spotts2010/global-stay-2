/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import SignupPage from '@/app/signup/page';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  type UserCredential,
  type AuthError,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Firebase Auth functions
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
}));

const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;
const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.Mock;
const mockSignInWithPopup = signInWithPopup as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('Authentication Pages', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockSignInWithEmailAndPassword.mockClear();
    mockCreateUserWithEmailAndPassword.mockClear();
    mockSignInWithPopup.mockClear();
  });

  // --- Login Page Tests ---
  describe('LoginPage', () => {
    it('should render the login form', () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should show an error message on failed email/password login', async () => {
      const error: AuthError = {
        code: 'auth/wrong-password',
        message: 'Invalid credentials.',
        name: 'FirebaseError',
      };
      mockSignInWithEmailAndPassword.mockRejectedValue(error);

      render(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
        expect(screen.getByText(error.message)).toBeInTheDocument();
      });
    });

    it('should redirect to home on successful email/password login', async () => {
      const userCredential = { user: { uid: '123' } } as UserCredential;
      mockSignInWithEmailAndPassword.mockResolvedValue(userCredential);

      render(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should redirect to home on successful Google sign-in', async () => {
      const userCredential = { user: { uid: '456' } } as UserCredential;
      mockSignInWithPopup.mockResolvedValue(userCredential);

      render(<LoginPage />);
      fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });
  });

  // --- Signup Page Tests ---
  describe('SignupPage', () => {
    it('should render the signup form', () => {
      render(<SignupPage />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should show an error message on failed email/password sign-up', async () => {
      const error: AuthError = {
        code: 'auth/email-already-in-use',
        message: 'Email already exists.',
        name: 'FirebaseError',
      };
      mockCreateUserWithEmailAndPassword.mockRejectedValue(error);

      render(<SignupPage />);

      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/sign-up failed/i)).toBeInTheDocument();
        expect(screen.getByText(error.message)).toBeInTheDocument();
      });
    });

    it('should redirect to home on successful email/password sign-up', async () => {
      const userCredential = { user: { uid: '789' } } as UserCredential;
      mockCreateUserWithEmailAndPassword.mockResolvedValue(userCredential);

      render(<SignupPage />);
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'New User' } });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'new@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'newpassword123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });
  });
});

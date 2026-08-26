import { AuthResponse, LoginCredentials, User } from '../types/auth';
import { MOCK_USERS } from './mockData';
import { simulateNetworkDelay } from './apiClient';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const EXPIRES_KEY = 'auth_expires_at';

// 8 hour token session lifetime
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

    if (USE_MOCK_API) {
      await simulateNetworkDelay(300);

      // Form validation check
      if (!credentials.email) {
        throw new Error('Email address is required');
      }

      // Check if email matches any mock user or match demo pattern
      let matchedUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (!matchedUser) {
        // Fallback default user for custom email entries
        const namePart = credentials.email.split('@')[0];
        const formattedName = namePart
          ? namePart.charAt(0).toUpperCase() + namePart.slice(1)
          : 'User';
        matchedUser = {
          id: `user-${Date.now()}`,
          name: formattedName,
          email: credentials.email,
          role: 'Developer',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=6366f1&color=fff`,
        };
      }

      const mockToken = `mock_jwt_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const expiresAt = Date.now() + SESSION_DURATION_MS;

      // Save to localStorage
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(matchedUser));
      localStorage.setItem(EXPIRES_KEY, expiresAt.toString());

      return {
        user: matchedUser,
        token: mockToken,
        expiresInSeconds: SESSION_DURATION_MS / 1000,
      };
    }

    // Real API integration
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(err.message || 'Authentication failed');
    }

    const data = await response.json();
    const token = data.token;
    const user = data.user;
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(EXPIRES_KEY, expiresAt.toString());

    return { user, token, expiresInSeconds: SESSION_DURATION_MS / 1000 };
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  },

  getCurrentSession(): { user: User | null; token: string | null; expiresAt: number | null } {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const expiresAtStr = localStorage.getItem(EXPIRES_KEY);

    if (!token || !userStr || !expiresAtStr) {
      return { user: null, token: null, expiresAt: null };
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) {
      // Token expired!
      this.logout();
      return { user: null, token: null, expiresAt: null };
    }

    try {
      const user: User = JSON.parse(userStr);
      return { user, token, expiresAt };
    } catch {
      this.logout();
      return { user: null, token: null, expiresAt: null };
    }
  },
};

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, AuthResponse } from '../../types/auth';
import { authService } from '../../services/authService';

const initialSession = authService.getCurrentSession();

const initialState: AuthState = {
  user: initialSession.user,
  token: initialSession.token,
  isAuthenticated: !!initialSession.token,
  isLoading: false,
  error: null,
  expiresAt: initialSession.expiresAt,
};

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.expiresAt = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
    checkSessionExpiration(state) {
      if (state.expiresAt && Date.now() > state.expiresAt) {
        authService.logout();
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.expiresAt = null;
        state.error = 'Session expired. Please log in again.';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expiresAt = Date.now() + action.payload.expiresInSeconds * 1000;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Failed to authenticate';
      });
  },
});

export const { logout, clearAuthError, checkSessionExpiration } = authSlice.actions;
export default authSlice.reducer;

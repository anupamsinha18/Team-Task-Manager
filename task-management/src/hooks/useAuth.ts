import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, logout, checkSessionExpiration, clearAuthError } from '../store/slices/authSlice';
import { LoginCredentials } from '../types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  // Periodically verify session validity
  useEffect(() => {
    dispatch(checkSessionExpiration());
    const interval = setInterval(() => {
      dispatch(checkSessionExpiration());
    }, 60000); // check every 60 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials)).unwrap();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const clearError = () => {
    dispatch(clearAuthError());
  };

  return {
    ...authState,
    login,
    logout: handleLogout,
    clearError,
  };
};

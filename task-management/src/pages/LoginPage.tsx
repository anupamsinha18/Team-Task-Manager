import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../store';
import { addToast } from '../store/slices/uiSlice';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validateEmail } from '../utils/validators';
import { Lock, Mail, Layers, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { MOCK_USERS } from '../services/mockData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('alex.morgan@company.com');
  const [password, setPassword] = useState('password123');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    if (!email || !email.trim()) {
      setEmailError('Email address is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    try {
      await login({ email, password });
      dispatch(
        addToast({
          type: 'success',
          title: 'Welcome back!',
          message: 'Successfully logged in to your workspace.',
        })
      );
      navigate(from, { replace: true });
    } catch (err: any) {
      // Error handled by state / toast
    }
  };

  const handleDemoUserLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
    setEmailError('');
    setPasswordError('');
  };

  return (
    <div className="login-page-container flex items-center justify-center min-h-screen p-4 bg-body-bg">
      <div className="login-card-wrapper w-full max-w-md">
        <div className="login-card-header text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-light text-primary mb-4 shadow-sm">
            <Layers size={32} />
          </div>
          <h1 className="text-2xl font-bold text-main">TaskPulse Dashboard</h1>
          <p className="text-muted text-sm mt-1">
            Production Project Management & Task Analytics Platform
          </p>
        </div>

        <div className="login-card bg-card-bg border rounded-2xl p-6 sm:p-8 shadow-lg">
          {error && (
            <div className="login-error-alert mb-6 p-3 rounded-lg bg-danger-light text-danger text-sm flex items-start gap-2">
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              error={passwordError}
              required
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              icon={<LogIn size={18} />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="demo-users-section mt-8 pt-6 border-t">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted mb-3">
              <Sparkles size={14} className="text-amber-500" />
              <span>Quick Login Demo Accounts</span>
            </div>

            <div className="demo-buttons-grid grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MOCK_USERS.slice(0, 2).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleDemoUserLogin(user.email)}
                  className={`demo-user-btn ${email === user.email ? 'demo-btn-active' : ''}`}
                >
                  <span className="font-medium text-xs block text-left truncate">{user.name}</span>
                  <span className="text-2xs text-muted block text-left">{user.role}</span>
                  {email === user.email && <CheckCircle2 size={12} className="demo-check-icon" />}
                </button>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

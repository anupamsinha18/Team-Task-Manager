import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, UserCheck } from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="header-title">Project Management</h1>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
        </button>

        {user && (
          <div className="header-user-profile">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
            ) : (
              <div className="user-avatar-fallback">
                <UserCheck size={18} />
              </div>
            )}
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          icon={<LogOut size={16} />}
          onClick={logout}
          title="Sign out of your session"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

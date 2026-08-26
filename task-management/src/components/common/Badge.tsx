import React from 'react';
import { TaskPriority, TaskStatus } from '../../types/task';

interface BadgeProps {
  variant?: 'priority' | 'status' | 'default';
  value: TaskPriority | TaskStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', value, className = '' }) => {
  let badgeStyle = 'badge-default';

  if (variant === 'priority') {
    switch (value) {
      case 'High':
        badgeStyle = 'badge-high-priority';
        break;
      case 'Medium':
        badgeStyle = 'badge-medium-priority';
        break;
      case 'Low':
        badgeStyle = 'badge-low-priority';
        break;
    }
  } else if (variant === 'status') {
    switch (value) {
      case 'Completed':
        badgeStyle = 'badge-status-completed';
        break;
      case 'In Progress':
        badgeStyle = 'badge-status-in-progress';
        break;
      case 'Pending':
        badgeStyle = 'badge-status-pending';
        break;
    }
  }

  return <span className={`badge ${badgeStyle} ${className}`}>{value}</span>;
};

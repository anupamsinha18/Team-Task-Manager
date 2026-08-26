import React from 'react';

interface SkeletonProps {
  variant?: 'card' | 'text' | 'title' | 'circle' | 'stat';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (variant === 'stat') {
    return (
      <div className="skeleton-grid-stats">
        {items.map((_, i) => (
          <div key={i} className="skeleton-stat-card skeleton-pulse" />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="skeleton-grid-cards">
        {items.map((_, i) => (
          <div key={i} className={`skeleton-card skeleton-pulse ${className}`}>
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-text" />
            <div className="skeleton-line skeleton-text short" />
            <div className="skeleton-footer flex justify-between items-center mt-4">
              <div className="skeleton-circle" />
              <div className="skeleton-badge" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`skeleton-line skeleton-${variant} skeleton-pulse ${className}`} />
  );
};

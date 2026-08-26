import React from 'react';
import { Card } from './Card';

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  variant?: 'total' | 'pending' | 'inProgress' | 'completed' | 'highPriority';
  subtitle?: string;
  badgeText?: string;
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(
  ({ title, count, icon, variant = 'total', subtitle, badgeText }) => {
    return (
      <Card className={`stats-card stats-card-${variant}`}>
        <div className="stats-card-header">
          <span className={`stats-card-icon icon-${variant}`}>{icon}</span>
          {badgeText && <span className="stats-card-badge">{badgeText}</span>}
        </div>
        <div className="stats-card-content">
          <h3 className="stats-card-count">{count}</h3>
          <p className="stats-card-title">{title}</p>
          {subtitle && <p className="stats-card-subtitle">{subtitle}</p>}
        </div>
      </Card>
    );
  }
);

StatsCard.displayName = 'StatsCard';

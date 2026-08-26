import React from 'react';
import { TaskStats } from '../../types/task';
import { StatsCard } from '../common/StatsCard';
import { SkeletonLoader } from '../common/SkeletonLoader';
import {
  ListTodo,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MetricsOverviewProps {
  stats: TaskStats | null;
  isLoading: boolean;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ stats, isLoading }) => {
  if (isLoading || !stats) {
    return <SkeletonLoader variant="stat" count={5} />;
  }

  return (
    <div className="metrics-grid">
      <StatsCard
        title="Total Tasks"
        count={stats.total}
        icon={<ListTodo size={24} />}
        variant="total"
        subtitle="Across all active projects"
      />
      <StatsCard
        title="Pending Tasks"
        count={stats.pending}
        icon={<Clock size={24} />}
        variant="pending"
        subtitle="Awaiting start"
      />
      <StatsCard
        title="In Progress"
        count={stats.inProgress}
        icon={<PlayCircle size={24} />}
        variant="inProgress"
        subtitle="Currently being worked on"
      />
      <StatsCard
        title="Completed Tasks"
        count={stats.completed}
        icon={<CheckCircle2 size={24} />}
        variant="completed"
        badgeText={`${stats.completionRate}% Done`}
        subtitle="Successfully finished"
      />
      <StatsCard
        title="High Priority"
        count={stats.highPriority}
        icon={<AlertTriangle size={24} />}
        variant="highPriority"
        badgeText="Critical"
        subtitle="Requires immediate attention"
      />
    </div>
  );
};

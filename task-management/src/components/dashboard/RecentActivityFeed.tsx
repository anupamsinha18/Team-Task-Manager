import React from 'react';
import { Task } from '../../types/task';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { Calendar, User } from 'lucide-react';

interface RecentActivityFeedProps {
  tasks: Task[];
  onViewTask: (task: Task) => void;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ tasks, onViewTask }) => {
  const recentTasks = tasks.slice(0, 5);

  return (
    <Card className="dashboard-widget">
      <div className="widget-header">
        <h3 className="widget-title">Recent Tasks</h3>
        <span className="text-xs text-muted">Latest Team Work items</span>
      </div>

      {recentTasks.length === 0 ? (
        <div className="empty-feed">
          <p className="text-muted text-sm">No recent activity found.</p>
        </div>
      ) : (
        <div className="activity-list">
          {recentTasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <div
                key={task.id}
                className="activity-item cursor-pointer"
                onClick={() => onViewTask(task)}
              >
                <div className="activity-main">
                  <h4 className="activity-task-title">{task.title}</h4>
                  <div className="activity-meta">
                    <span className="meta-item">
                      <User size={13} />
                      <span>{task.assignedUser.name}</span>
                    </span>
                    <span className={`meta-item ${overdue ? 'text-danger font-medium' : ''}`}>
                      <Calendar size={13} />
                      <span>{formatDate(task.dueDate)}</span>
                    </span>
                  </div>
                </div>

                <div className="activity-badges">
                  <Badge variant="priority" value={task.priority} />
                  <Badge variant="status" value={task.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

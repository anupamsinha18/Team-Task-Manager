import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDate, isOverdue, getDaysRemaining } from '../../utils/dateUtils';
import { Calendar, User, Edit3, Trash2, Eye, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

// Performance Optimization: React.memo prevents re-rendering un-modified TaskCards
export const TaskCard: React.FC<TaskCardProps> = React.memo(
  ({ task, onEdit, onDelete, onView, onStatusChange }) => {
    const overdue = isOverdue(task.dueDate, task.status);
    const daysText = getDaysRemaining(task.dueDate);

    return (
      <Card className={`task-card ${overdue ? 'task-card-overdue' : ''}`}>
        <div className="task-card-header">
          <div className="flex items-center gap-2">
            <Badge variant="priority" value={task.priority} />
            {overdue && (
              <span className="overdue-tag flex items-center gap-1 text-danger font-medium text-xs">
                <AlertCircle size={13} />
                <span>Overdue</span>
              </span>
            )}
          </div>

          <div className="task-actions flex items-center gap-1">
            <button
              type="button"
              className="task-action-btn"
              onClick={() => onView(task)}
              title="View Task Details"
            >
              <Eye size={16} />
            </button>
            <button
              type="button"
              className="task-action-btn"
              onClick={() => onEdit(task)}
              title="Edit Task"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              className="task-action-btn text-danger-hover"
              onClick={() => onDelete(task)}
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="task-card-body my-3" onClick={() => onView(task)}>
          <h3 className="task-title hover:text-primary transition-colors cursor-pointer">
            {task.title}
          </h3>
          <p className="task-description text-muted line-clamp-2 mt-1">{task.description}</p>

          {task.tags && task.tags.length > 0 && (
            <div className="task-tags flex flex-wrap gap-1 mt-3">
              {task.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="task-card-footer pt-3 border-t flex items-center justify-between">
          <div className="assigned-user-info flex items-center gap-2">
            {task.assignedUser.avatarUrl ? (
              <img
                src={task.assignedUser.avatarUrl}
                alt={task.assignedUser.name}
                className="user-avatar-sm"
              />
            ) : (
              <div className="user-avatar-sm-fallback">
                <User size={14} />
              </div>
            )}
            <span className="user-name-sm text-xs font-medium">{task.assignedUser.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="due-date-badge flex items-center gap-1 text-xs text-muted">
              <Calendar size={13} />
              <span>{formatDate(task.dueDate)}</span>
              {daysText && <span className="text-2xs text-secondary">({daysText})</span>}
            </div>

            {/* Quick Status Selector */}
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className={`status-quick-select status-select-${task.status.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>
    );
  }
);

TaskCard.displayName = 'TaskCard';

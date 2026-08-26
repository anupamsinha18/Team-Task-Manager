import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import { Badge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { Edit3, Trash2, Eye, User, Calendar } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
}) => {
  return (
    <div className="table-responsive bg-card-bg border rounded-xl overflow-hidden shadow-sm">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Assigned User</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <tr key={task.id} className="task-table-row">
                <td className="font-medium cursor-pointer" onClick={() => onView(task)}>
                  <div className="task-title-cell">
                    <span className="task-title-text hover:text-primary">{task.title}</span>
                    <span className="task-desc-sub text-xs text-muted line-clamp-1">
                      {task.description}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {task.assignedUser.avatarUrl ? (
                      <img
                        src={task.assignedUser.avatarUrl}
                        alt={task.assignedUser.name}
                        className="user-avatar-xs"
                      />
                    ) : (
                      <User size={14} className="text-muted" />
                    )}
                    <span className="text-sm font-medium">{task.assignedUser.name}</span>
                  </div>
                </td>
                <td>
                  <Badge variant="priority" value={task.priority} />
                </td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                    className="status-quick-select-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <div className={`flex items-center gap-1 text-sm ${overdue ? 'text-danger font-medium' : ''}`}>
                    <Calendar size={14} />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </td>
                <td className="text-right">
                  <div className="table-actions flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="task-action-btn"
                      onClick={() => onView(task)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      className="task-action-btn"
                      onClick={() => onEdit(task)}
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      className="task-action-btn text-danger-hover"
                      onClick={() => onDelete(task)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

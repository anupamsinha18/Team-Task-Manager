import React from 'react';
import { Task } from '../../types/task';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatDate, isOverdue, getDaysRemaining } from '../../utils/dateUtils';
import { Calendar, User, Clock, AlertTriangle, Edit3, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
}) => {
  if (!task) return null;

  const overdue = isOverdue(task.dueDate, task.status);
  const daysText = getDaysRemaining(task.dueDate);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Overview" maxWidth="md">
      <div className="task-detail-container space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="priority" value={task.priority} />
            <Badge variant="status" value={task.status} />
            {overdue && (
              <span className="badge bg-danger-light text-danger flex items-center gap-1 font-medium text-xs">
                <AlertTriangle size={13} />
                Overdue
              </span>
            )}
          </div>

          <div className="text-xs text-muted">ID: {task.id}</div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-main mb-2">{task.title}</h2>
          <p className="text-muted text-sm whitespace-pre-line leading-relaxed">
            {task.description}
          </p>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="detail-meta-grid grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-body-bg border">
          <div className="meta-block">
            <span className="text-xs text-muted block mb-1">Assigned User</span>
            <div className="flex items-center gap-2">
              {task.assignedUser.avatarUrl ? (
                <img
                  src={task.assignedUser.avatarUrl}
                  alt={task.assignedUser.name}
                  className="user-avatar-sm"
                />
              ) : (
                <User size={16} className="text-muted" />
              )}
              <div>
                <div className="text-sm font-semibold">{task.assignedUser.name}</div>
                <div className="text-xs text-muted">{task.assignedUser.email}</div>
              </div>
            </div>
          </div>

          <div className="meta-block">
            <span className="text-xs text-muted block mb-1">Timeline & Due Date</span>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className={overdue ? 'text-danger' : 'text-primary'} />
              <span className={`font-medium ${overdue ? 'text-danger' : ''}`}>
                {formatDate(task.dueDate)}
              </span>
              {daysText && <span className="text-xs text-muted">({daysText})</span>}
            </div>
            <div className="text-2xs text-muted mt-1 flex items-center gap-1">
              <Clock size={11} />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            Delete
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Edit3 size={16} />}
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              Edit Task
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

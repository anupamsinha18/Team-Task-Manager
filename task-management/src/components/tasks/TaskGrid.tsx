import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { SearchX } from 'lucide-react';
import { Button } from '../common/Button';

interface TaskGridProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onCreateNew?: () => void;
}

export const TaskGrid: React.FC<TaskGridProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  onCreateNew,
}) => {
  if (isLoading) {
    return <SkeletonLoader variant="card" count={6} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state-container text-center py-12 px-4 border rounded-xl bg-card-bg">
        <div className="empty-state-icon mx-auto mb-4 text-muted flex justify-center">
          <SearchX size={48} />
        </div>
        <h3 className="text-lg font-bold mb-1">No tasks found</h3>
        <p className="text-muted text-sm max-w-md mx-auto mb-6">
          No task items match your current search query or filter criteria. Try resetting filters or create a new task.
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew}>Create New Task</Button>
        )}
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

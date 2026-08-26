import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

interface TaskKanbanProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
}) => {
  const pendingTasks = tasks.filter((t) => t.status === 'Pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="kanban-board-grid">
      {/* Column: Pending */}
      <div className="kanban-column">
        <div className="kanban-column-header header-pending">
          <div className="flex items-center gap-2">
            <Circle size={16} className="text-warning" />
            <h3 className="kanban-title">Pending</h3>
          </div>
          <span className="kanban-count-badge">{pendingTasks.length}</span>
        </div>
        <div className="kanban-column-body">
          {pendingTasks.map((task) => (
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
      </div>

      {/* Column: In Progress */}
      <div className="kanban-column">
        <div className="kanban-column-header header-in-progress">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h3 className="kanban-title">In Progress</h3>
          </div>
          <span className="kanban-count-badge">{inProgressTasks.length}</span>
        </div>
        <div className="kanban-column-body">
          {inProgressTasks.map((task) => (
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
      </div>

      {/* Column: Completed */}
      <div className="kanban-column">
        <div className="kanban-column-header header-completed">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success" />
            <h3 className="kanban-title">Completed</h3>
          </div>
          <span className="kanban-count-badge">{completedTasks.length}</span>
        </div>
        <div className="kanban-column-body">
          {completedTasks.map((task) => (
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
      </div>
    </div>
  );
};
